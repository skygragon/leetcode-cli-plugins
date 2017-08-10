var _ = require('underscore');
var cheerio = require('cheerio');
var request = require('request');
var util = require('util');

var h = require('../helper');
var log = require('../log');
var Plugin = require('../plugin');
var queue = require('../queue');
var session = require('../session');

// Still working in progress!
//
// TODO: star/submissions/submission
// FIXME: why [ERROR] Error: read ECONNRESET [0]??
//
var plugin = new Plugin(15, 'lintcode', '2017.08.04',
    'Plugin to talk with lintcode APIs.');

var config = {
  URL_BASE:          'http://www.lintcode.com/en',
  URL_PROBLEMS:      'http://www.lintcode.com/en/problem?page=$page',
  URL_PROBLEM:       'http://www.lintcode.com/en/problem/$slug/',
  URL_PROBLEM_CODE:  'http://www.lintcode.com/en/problem/api/code/?problem_id=$id&language=$lang',
  URL_TEST:          'http://www.lintcode.com/submission/api/submit/',
  URL_TEST_VERIFY:   'http://www.lintcode.com/submission/api/refresh/?id=$id&waiting_time=0&is_test_submission=true',
  URL_SUBMIT_VERIFY: 'http://www.lintcode.com/submission/api/refresh/?id=$id&waiting_time=0',
  URL_LOGIN:         'http://www.lintcode.com/en/accounts/signin/'
};

var LANGS = [
  {value: 'cpp', text: 'C++'},
  {value: 'java', text: 'Java'},
  {value: 'python', text: 'Python'}
];

function signOpts(opts, user) {
  opts.headers.Cookie = 'sessionid=' + user.sessionId +
                        ';csrftoken=' + user.sessionCSRF + ';';
}

function makeOpts(url) {
  var opts = {};
  opts.url = url;
  opts.headers = {};

  if (session.isLogin())
    signOpts(opts, session.getUser());
  return opts;
}

function checkError(e, resp, expectedStatus) {
  if (!e && resp && resp.statusCode !== expectedStatus) {
    var code = resp.statusCode;
    log.debug('http error: ' + code);

    if (code === 403 || code === 401) {
      e = session.errors.EXPIRED;
    } else {
      e = {msg: 'http error', statusCode: code};
    }
  }
  return e;
}

function _split(s, delim) {
  return (s || '').split(delim).map(function(x) {
    return x.trim();
  }).filter(function(x) {
    return x.length > 0;
  });
}

function _strip(s) {
  s = s.replace(/^<pre><code>/, '').replace(/<\/code><\/pre>$/, '');
  return util.inspect(s.trim());
}

plugin.getProblems = function(cb) {
  log.debug('running lintcode.getProblems');

  var problems = [];
  var doTask = function(page, taskDone) {
    plugin.getPageProblems(page, function(e, _problems) {
      if (!e) problems = problems.concat(_problems);
      return taskDone(e);
    });
  };

  // FIXME: remove this hardcoded range!
  var pages = [0, 1, 2, 3, 4];
  queue.run(pages, doTask, function(e) {
    problems = _.sortBy(problems, function(x) {
      return -x.id;
    });
    return cb(e, problems);
  });
};

plugin.getPageProblems = function(page, cb) {
  log.debug('running lintcode.getPageProblems: ' +  page);
  var opts = makeOpts(config.URL_PROBLEMS.replace('$page', page));

  request(opts, function(e, resp, body) {
    e = checkError(e, resp, 200);
    if (e) return cb(e);

    var $ = cheerio.load(body);
    var problems = $('div[id=problem_list_pagination] a').map(function(i, a) {
      var problem = {
        locked:    false,
        category:  'lintcode',
        state:     'None',
        starred:   false,
        companies: [],
        tags:      []
      };
      problem.slug = $(a).attr('href').split('/').pop();
      problem.link = config.URL_PROBLEM.replace('$slug', problem.slug);

      $(a).children('span').each(function(i, span) {
        var text = $(span).text().trim();
        var type = _split($(span).attr('class'), ' ');
        type = type.concat(_split($(span).find('i').attr('class'), ' '));

        if (type.indexOf('title') >= 0) {
          problem.id = Number(text.split('.')[0]);
          problem.name = text.split('.')[1].trim();
        } else if (type.indexOf('difficulty') >= 0) problem.level = text;
        else if (type.indexOf('rate') >= 0) problem.percent = parseInt(text, 10);
        else if (type.indexOf('fa-star') >= 0) problem.starred = true;
        else if (type.indexOf('fa-check') >= 0) problem.state = 'ac';
        else if (type.indexOf('fa-minus') >= 0) problem.state = 'notac';
        else if (type.indexOf('fa-briefcase') >= 0) problem.companies = _split($(span).attr('title'), ',');
      });

      return problem;
    }).get();

    return cb(null, problems);
  });
};

plugin.getProblem = function(problem, cb) {
  log.debug('running lintcode.getProblem');
  var opts = makeOpts(problem.link);

  request(opts, function(e, resp, body) {
    e = checkError(e, resp, 200);
    if (e) return cb(e);

    var $ = cheerio.load(body);
    problem.testcase = $('textarea[id=input-testcase]').text();
    problem.testable = problem.testcase.length > 0;

    var lines = [];
    $('div[id=description] > div').each(function(i, div) {
      if (i === 0) {
        div = $(div).find('div')[0];
        lines.push($(div).text().trim());
        return;
      }

      var text = $(div).text().trim();
      var type = $(div).find('b').text().trim();

      if (type === 'Tags') {
        problem.tags = _split(text, '\n');
        problem.tags.shift();
      } else if (type === 'Related Problems') return;
      else lines.push(text);
    });
    problem.desc = lines.join('\n').replace(/\n{2,}/g, '\n');
    problem.totalAC = '';
    problem.totalSubmit = '';
    problem.templates = [];

    var doTask = function(lang, taskDone) {
      plugin.getProblemCode(problem, lang, function(e, code) {
        if (e) return taskDone(e);

        lang = _.clone(lang);
        lang.defaultCode = code;
        problem.templates.push(lang);
        return taskDone();
      });
    };

    queue.run(LANGS, doTask, function(e) {
      return cb(e, problem);
    });
  });
};

plugin.getProblemCode = function(problem, lang, cb) {
  log.debug('running lintcode.getProblemCode:' + lang.value);
  var url = config.URL_PROBLEM_CODE
    .replace('$id', problem.id)
    .replace('$lang', lang.text.replace(/\+/g, '%2b'));
  var opts = makeOpts(url);

  request(opts, function(e, resp, body) {
    e = checkError(e, resp, 200);
    if (e) return cb(e);

    var json = JSON.parse(body);
    return cb(null, json.code);
  });
};

function runCode(problem, isTest, cb) {
  var lang = _.find(LANGS, function(x) {
    return x.value === h.extToLang(problem.file);
  });

  var opts = makeOpts(config.URL_TEST);
  opts.form = {
    problem_id:          problem.id,
    code:                h.getFileData(problem.file),
    language:            lang.text,
    csrfmiddlewaretoken: session.getUser().sessionCSRF
  };
  if (isTest) {
    opts.form.input = problem.testcase;
    opts.form.is_test_submission = true;
  }

  request.post(opts, function(e, resp, body) {
    e = checkError(e, resp, 200);
    if (e) return cb(e);

    var json = JSON.parse(body);
    if (!json.id || !json.success) return cb(json.message);

    verifyResult(json.id, isTest, cb);
  });
}

function verifyResult(id, isTest, cb) {
  log.debug('running verifyResult:' + id);
  var url = isTest ? config.URL_TEST_VERIFY : config.URL_SUBMIT_VERIFY;
  var opts = makeOpts(url.replace('$id', id));

  request(opts, function(e, resp, body) {
    e = checkError(e, resp, 200);
    if (e) return cb(e);

    var result = JSON.parse(body);
    if (result.status === 'Compiling' || result.status === 'Running')
      return setTimeout(verifyResult, 1000, id, isTest, cb);

    return cb(null, formatResult(result));
  });
}

function formatResult(result) {
  var x = {
    ok:              result.status === 'Accepted',
    type:            'Actual',
    state:           result.status,
    runtime:         result.time_cost + ' ms',
    answer:          _strip(result.output),
    stdout:          _strip(result.stdout),
    expected_answer: _strip(result.expected),
    testcase:        _strip(result.input),
    passed:          result.data_accepted_count || 0,
    total:           result.data_total_count || 0
  };

  var error = [];
  if (result.compile_info.length > 0)
    error = error.concat(_split(result.compile_info, '<br>'));
  if (result.error_message.length > 0)
    error = error.concat(_split(result.error_message, '<br>'));
  x.error = error;

  // make sure everything is ok
  if (error.length > 0) x.ok = false;
  if (x.passed !== x.total) x.ok = false;

  return x;
}

plugin.testProblem = function(problem, cb) {
  log.debug('running lintcode.testProblem');
  runCode(problem, true, function(e, result) {
    if (e) return cb(e);

    var expected = {
      ok:     true,
      type:   'Expected',
      answer: result.expected_answer,
      stdout: "''"
    };
    return cb(null, [result, expected]);
  });
};

plugin.submitProblem = function(problem, cb) {
  log.debug('running lintcode.submitProblem');
  runCode(problem, false, function(e, result) {
    if (e) return cb(e);
    return cb(null, [result]);
  });
};

plugin.getSubmission = function(submission, cb) {
  // FIXME
  return cb('Not implemented');
};

plugin.login = function(user, cb) {
  log.debug('running lintcode.login');
  request(config.URL_LOGIN, function(e, resp, body) {
    e = checkError(e, resp, 200);
    if (e) return cb(e);

    user.loginCSRF = h.getSetCookieValue(resp, 'csrftoken');

    var opts = {
      url:     config.URL_LOGIN,
      headers: {
        Cookie: 'csrftoken=' + user.loginCSRF + ';'
      },
      form: {
        csrfmiddlewaretoken: user.loginCSRF,
        username_or_email:   user.login,
        password:            user.pass
      }
    };
    request.post(opts, function(e, resp, body) {
      if (e) return cb(e);
      if (resp.statusCode !== 302) return cb('invalid password?');

      user.sessionCSRF = h.getSetCookieValue(resp, 'csrftoken');
      user.sessionId = h.getSetCookieValue(resp, 'sessionid');
      user.name = user.login; // FIXME

      return cb(null, user);
    });
  });
};

module.exports = plugin;
