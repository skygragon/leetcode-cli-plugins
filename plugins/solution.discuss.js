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
var plugin = new Plugin(200, 'solution.discuss', '2018.04.14',
    'Plugin to fetch most voted solution in discussions.');

var URL_DISCUSSES = 'https://leetcode.com/graphql';
var URL_DISCUSS = 'https://leetcode.com/problems/$slug/discuss/$id';

function getSolution(problem, lang, cb) {
  if (!problem) return cb();

  var opts = {
    url:  URL_DISCUSSES,
    json: true,
    qs: {
      query: [
        'query fetchTopics($questionId: Int!, $pageNo: Int!, $orderBy: String!) {',
        '  questionTopics(questionId: $questionId, pageNo: $pageNo, orderBy: $orderBy) {',
        '    data {',
        '      id',
        '      title',
        '      post {',
        '        content',
        '        voteCount',
        '        author {',
        '          username',
        '        }',
        '      }',
        '    }',
        '  }',
        '}'
      ].join('\n'),
      operationName: 'fetchTopics',
      variables: JSON.stringify({
        pageNo:     1,
        orderBy:    'most_votes',
        questionId: problem.id
      })
    }
  };
  request(opts, function(e, resp, body) {
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

    var solutions = body.data.questionTopics.data;
    var solution = _.find(solutions, function(x) {
      var keys = x.title.toLowerCase().split(/[^\w+]/);
      for (var i = 0; i < keys.length; ++i) {
        if (langs.indexOf(keys[i]) >= 0) return true;
      }
      return false;
    });

    return cb(null, solution);
  });
}

plugin.getProblem = function(problem, cb) {
  plugin.next.getProblem(problem, function(e, problem) {
    if (e || !session.argv.solution) return cb(e, problem);

    var lang = session.argv.lang;
    getSolution(problem, lang, function(e, solution) {
      if (e) return cb(e);
      if (!solution) return log.error('Solution not found for ' + lang);

      var link = URL_DISCUSS.replace('$slug', problem.slug).replace('$id', solution.id);
      var content = solution.post.content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

      log.info();
      log.info(solution.title);
      log.info();
      log.info(chalk.underline(link));
      log.info();
      log.info('* Lang:    ' + lang);
      log.info('* Author:  ' + solution.post.author.username);
      log.info('* Votes:   ' + solution.post.voteCount);
      log.info();
      log.info(content);
    });
  });
};

module.exports = plugin;
