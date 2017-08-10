var path = require('path');
var url = require('url');

var h = require('../helper');
var log = require('../log');
var Plugin = require('../plugin');

// [prerequisite]
//
// - create a new access token on your github repo setting. (TBD)
//
// [config]
//
// "PLUGINS": {
//   "github": {
//     "repo": "https://github.com/<your_name>/<your_repo>/<folder_you_like>",
//     "token": "<token created above>"
//   }
// }
var plugin = new Plugin(100, 'github', '2017.08.10',
    'Plugin to commit accepted code to your own github repo.',
    ['github']);

var ctx = {};

plugin.submitProblem = function(problem, cb) {
  var parts = url.parse(this.config.repo).pathname.split('/');
  var filename = path.basename(problem.file);
  parts.push(filename);

  if (parts[0] === '') parts.shift();
  ctx.owner = parts.shift();
  ctx.repo = parts.shift();
  ctx.path = parts.join('/');

  var GitHubApi = require('github');
  var github = new GitHubApi({host: 'api.github.com'});
  github.authenticate({type: 'token', token: this.config.token});

  plugin.next.submitProblem(problem, function(_e, results) {
    cb(_e, results);
    if (_e || !results[0].ok) return;

    log.debug('running github.getContent: ' + filename);
    github.repos.getContent(ctx, function(e, res) {
      if (e && e.code !== 404) {
        return log.info('  ' + h.prettyText(' ' + e.message, false));
      }

      ctx.message = 'update ' + filename;
      ctx.content = new Buffer(h.getFileData(problem.file)).toString('base64');

      var onFileDone = function(e, res) {
        if (e)
          return log.info('  ' + h.prettyText(' ' + e.message, false));

        log.debug(res.meta.status);
        log.debug('updated current file version = ' + res.data.content.sha);
        log.debug('updated current commit = ' + res.data.commit.sha);
        log.info('  ' + h.prettyText(' Committed to ' + plugin.config.repo, true));
      };

      if (e) {
        log.debug('no previous file version found');

        log.debug('running github.createFile');
        github.repos.createFile(ctx, onFileDone);
      } else {
        ctx.sha = res.data.sha;
        log.debug('found previous file version = ' + ctx.sha);

        log.debug('running github.updateFile');
        github.repos.updateFile(ctx, onFileDone);
      }
    });
  });
};

module.exports = plugin;
