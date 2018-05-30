# leetcode-cli-plugins

<img src="docs/logo.png" align="right">

3rd party plugins for leetcode-cli.

* what is [leetcode-cli](https://github.com/skygragon/leetcode-cli)
* how to use [leetcode-cli plugins](https://skygragon.github.io/leetcode-cli/commands#plugin)
* how to use [leetcode-cli configs](https://skygragon.github.io/leetcode-cli/advanced#configuration)

## Plugins

|Name|Description|Enhanced Commands|
|----|-----------|-----------------|
|[company](/docs/company.md)|Filter questions by company or tags|`list`|
|[cookie.chrome](/docs/cookie.chrome.md)|Don't expire Chrome's session on same computer|`login`|
|[cookie.firefox](/docs/cookie.firefox.md)|Don't expire Firefox's session on same computer|`login`|
|[cpp.lint](/docs/cpp.lint.md)|C++ code syntax check|`test`|
|[cpp.run](/docs/cpp.run.md)|Test C++ code locally|`test`|
|[github](/docs/github.md)|Commit accpeted code to GitHub|`submit`|
|[leetcode.cn](/docs/leetcode.cn.md)|Fight questions from leetcode-cn.com||
|[lintcode](/docs/lintcode.md)|Fight questions from lintcode.com|`list` `show` `test` `submit` `user`|
|[solution.discuss](/docs/solution.discuss.md)|Fetch top voted solution|`show`|

## Quick Start

    $ leetcode plugin -i <name>                          # install
    $ leetcode plugin -d <name>                          # disable
    $ leetcode plugin -e <name>                          # enable
    $ leetcode plugin -D <name>                          # delete

    $ leetcode plugin -c <name>                          # show config
    $ leetcode config plugins:<name>                     # show config
    $ leetcode config plugins:<name>:<key> <value>       # set config
    $ leetcode config -d plugins:<name>                  # delete config

**Example**

    $ leetcode plugin -i company                         # install compnay
    $ leetcode plugin -D compnay                         # delete company

    $ leetcode plugin -c github                          # show github plugin config
    $ leetcode config plugins:github                     # show github plugin config
    $ leetcode config plugins:github:token 12345678      # set github plugin config
    $ leetcode config -d plugins:github                  # delete github plugin config
