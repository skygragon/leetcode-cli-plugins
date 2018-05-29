var Plugin = require('../plugin');

//
// [Usage]
//
// https://github.com/skygragon/leetcode-cli-plugins/blob/master/docs/leetcode.cn.md
//
var plugin = new Plugin(15, 'leetcode.cn', '2018.05.29',
    'Plugin to talk with leetcode-cn APIs.');

plugin.init = function() {
  const config = require('../config');
  config.sys.urls.base            = 'https://leetcode-cn.com';
  config.sys.urls.login           = 'https://leetcode-cn.com/accounts/login/';
  config.sys.urls.problems        = 'https://leetcode-cn.com/api/problems/$category/';
  config.sys.urls.problem         = 'https://leetcode-cn.com/problems/$slug/description/';
  config.sys.urls.problem_detail  = 'https://leetcode-cn.com/graphql';
  config.sys.urls.test            = 'https://leetcode-cn.com/problems/$slug/interpret_solution/';
  config.sys.urls.session         = 'https://leetcode-cn.com/session/';
  config.sys.urls.submit          = 'https://leetcode-cn.com/problems/$slug/submit/';
  config.sys.urls.submissions     = 'https://leetcode-cn.com/api/submissions/$slug';
  config.sys.urls.submission      = 'https://leetcode-cn.com/submissions/detail/$id/';
  config.sys.urls.verify          = 'https://leetcode-cn.com/submissions/detail/$id/check/';
  config.sys.urls.favorites       = 'https://leetcode-cn.com/list/api/questions';
  config.sys.urls.favorite_delete = 'https://leetcode-cn.com/list/api/questions/$hash/$id';
};

module.exports = plugin;
