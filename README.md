# leetcode-cli-plugins
3rd party plugins for leetcode-cli.

|Plugin|Description|Enhanced Commands|
|-|-|-|
|[company](/docs/company.md)|Filter questions by company|`list`|
|[cpp.lint](/docs/cpp.lint.md)|C++ code syntax check|`test`|
|[cpp.run](/docs/cpp.run.md)|Test C++ code locally|`test`|
|[github](/docs/github.md)|Commit accpeted code to GitHub|`submit`|
|[lintcode](/docs/lintcode.md)|Fight questions from lintcode.com|`list` `show` `test` `submit` `user`|
|[solution.discuss](/docs/solution.discuss.md)|Fetch top voted solution|`show`|

## HOWTO

You can install the plugins in either ways below:

### Quick Install

Install from GitHub:

    $ leetcode plugin -i <plugin name>
    
*Example*

    $ leetcode plugin -i company
    
Install from local file:

    $ leetcode plugin -i <plugin js file>

To manage the installed plugins, please check [leetcode-cli's user guide](https://skygragon.github.io/leetcode-cli/commands#plugin).

### Configuration

Some plugins could be configured with your customized options.

Check [leetcode-cli's configuration](https://skygragon.github.io/leetcode-cli/advanced#configuration) for more details.
