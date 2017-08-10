var _ = require('underscore');
var request = require('request');

var log = require('../log');
var chalk = require('../chalk');
var Plugin = require('../plugin');
var session = require('../session');

var plugin = new Plugin(200, 'solution.discuss', '2017.07.29',
    'Plugin to fetch most voted solution in discussions.');

var URL_DISCUSSES = 'https://discuss.leetcode.com/api/category/';
var URL_DISCUSS_TOPIC = 'https://discuss.leetcode.com/topic/';

plugin.getProblem = function(problem, cb) {
  plugin.next.getProblem(problem, function(e, problem) {
    if (e || !session.argv.solution) return cb(e, problem);

    var opts = {
      url: URL_DISCUSSES + problem.discuss
    };
    request(opts, function(e, resp, body) {
      if (e) return cb(e);
      if (resp.statusCode !== 200)
        return cb({msg: 'http error', statusCode: resp.statusCode});

      var lang = session.argv.lang;
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

      if (!solution) {
        return log.error('Solution not found for ' + lang);
      }

      log.info(solution._imported_title);
      log.info();
      log.info(chalk.underline(URL_DISCUSS_TOPIC + solution.slug));
      log.info();
      log.info('* Lang:  ' + lang);
      log.info('* Votes: ' + solution.votes);
      log.info();
      log.info(chalk.yellow(solution._imported_content));
    });
  });
};

module.exports = plugin;
