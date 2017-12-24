# leetcode-cli-plugins
3rd party plugins for leetcode-cli.

|Plugin|Description|Enhanced Commands|
|------|-----------|-----------------|
|[company](/docs/company.md)|Filter questions by company or tags|`list`|
|[cookie.chrome](/docs/cookie.chrome.md)|Don't expire Chrome's session on same computer|`login`|
|[cpp.lint](/docs/cpp.lint.md)|C++ code syntax check|`test`|
|[cpp.run](/docs/cpp.run.md)|Test C++ code locally|`test`|
|[github](/docs/github.md)|Commit accpeted code to GitHub|`submit`|
|[lintcode](/docs/lintcode.md)|Fight questions from lintcode.com|`list` `show` `test` `submit` `user`|
|[solution.discuss](/docs/solution.discuss.md)|Fetch top voted solution|`show`|

## HOWTO

### Install

Install plugin from this GitHub repo:

    $ leetcode plugin -i <name>
    
*Example*

    $ leetcode plugin -i company

**NOTE: Check [leetcode-cli's plugin guide](https://skygragon.github.io/leetcode-cli/commands#plugin) for more details.**

### Configuration

Some plugins could be configured with your customized options. Please read plugin's doc to see the details.

*Example*

Take `gitHub` plugin for example:

Set configs:

	$ leetcode config plugins.github.token 12345678

Show configs:

	$ leetcode config plugins.github
	$ leetcode plugin -c github

Delete configs:

	$ leetcode config -d plugins.github

**NOTE: Check [leetcode-cli's configuration guide](https://skygragon.github.io/leetcode-cli/advanced#configuration) for more details.**

### Management

Disable:

	$ leetcode plugin -d <name>

Enable:

	$ leetcode plugin -e <name>

Delete:

	$ leetcode plugin -D <name>