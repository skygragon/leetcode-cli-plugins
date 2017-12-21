var _ = require('underscore');
var cheerio = require('cheerio');
var request = require('request');

var log = require('../log');
var chalk = require('../chalk');
var Plugin = require('../plugin');
var session = require('../session');

//
// [Usage]
//
// https://github.com/skygragon/leetcode-cli-plugins/blob/master/docs/solution.discuss.md
//
var plugin = new Plugin(200, 'solution.discuss', '2017.07.29',
    'Plugin to fetch most voted solution in discussions.');

var URL_DISCUSSES = 'https://discuss.leetcode.com/api/category/';
var URL_DISCUSS_TOPIC = 'https://discuss.leetcode.com/topic/';
var URL_DISCUSS_TOPIC_API = 'https://discuss.leetcode.com/api/topic/';

function getSolutionDetail(solution, cb) {
  if (!solution) return cb();

  request(URL_DISCUSS_TOPIC_API + solution.slug, function(e, resp, body) {
    if (e) return cb(e);
    if (resp.statusCode !== 200)
      return cb({msg: 'http error', statusCode: resp.statusCode});

    var data = JSON.parse(body);
    solution.title = data.titleRaw;
    var $ = cheerio.load(data.posts[0].content);
    solution.content = $.root().text();
    return cb(null, solution);
  });
}

function getSolution(problem, lang, cb) {
  if (!problem) return cb();

  request(URL_DISCUSSES + problem.discuss, function(e, resp, body) {
    if (e) return cb(e);
    if (resp.statusCode !== 200)
      return cb({msg: 'http error', statusCode: resp.statusCode});

    var langs = [lang];
    // try to find more compatible langs
    if (lang === 'cpp') langs.push('c++');
    if (lang === 'csharp') langs.push('c#');
    if (lang === 'golang') langs.push('go');
    if (lang === 'javascript') langs.push('js');
    if (lang === 'python3') langs.push('python');

    var data = JSON.parse(body);
    var solution = _.find(data.topics, function(x) {
      var keys = x.title.toLowerCase().split(' ');
      for (var i = 0; i < keys.length; ++i) {
        if (langs.indexOf(keys[i]) >= 0) return true;
      }
      return false;
    });

    return getSolutionDetail(solution, cb);
  });
}

plugin.getProblem = function(problem, cb) {
  plugin.next.getProblem(problem, function(e, problem) {
    if (e || !session.argv.solution) return cb(e, problem);

    var lang = session.argv.lang;
    getSolution(problem, lang, function(e, solution) {
      if (e) return cb(e);
      if (!solution) return log.error('Solution not found for ' + lang);

      log.info();
      log.info(solution.title);
      log.info();
      log.info(chalk.underline(URL_DISCUSS_TOPIC + solution.slug));
      log.info();
      log.info('* Lang:    ' + lang);
      log.info('* Author:  ' + solution.user.username);
      log.info('* Votes:   ' + solution.votes);
      log.info();
      log.info(solution.content);
    });
  });
};

module.exports = plugin;
