# cookie.firefox

Same as [cookie.chrome](https://github.com/skygragon/leetcode-cli-plugins/blob/master/docs/cookie.chrome.md), but works for Firefox.

## Usage

If enabled, the login will try to reuse existing Firefox cookies. You can verify it by printing debug output as below.

	$ leetcode user -l -v
	login: <you account>
	pass:
	[DEBUG] running cookie.firefox.login
	[DEBUG] running cookie.firefox.signin
	[DEBUG] try to copy leetcode cookies from firefox ...
	[DEBUG] Successfully copied leetcode cookies!
	[DEBUG] running leetcode.getFavorites
	Successfully login as <your account>

