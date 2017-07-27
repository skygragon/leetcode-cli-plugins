# leetcode-cli-plugins
3rd party plugins for leetcode-cli

|Plugin|Description|
|-|-|
|company.js|Filter question by company tag.|
|cpp.lint.js|Run cpplint to check syntax before running test.|

## HOWTO

You can install the plugins in either ways below:

### Quick Install

    $ leetcode install <plugin file>

### Manually Install

Copy the plugin file to the sub folder `lib/plugins/` where leetcode-cli installed.

E.g. On Linux/Mac, the path would be like: `/usr/local/lib/node_modules/leetcode-cli/lib/plugins/`

Tips: You can find the path by running `npm`, check the last line of the output.
