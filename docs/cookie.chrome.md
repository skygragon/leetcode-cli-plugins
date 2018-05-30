# cookie.chrome

Leetcode.com only permits one live session for same account, which means if you login successfully via leetcode-cli, your existing session in browser will get expired, and vice versa.

This plugin enables leetcode-cli to try to reuse the existing session in your chrome borwser on the same computer.

If succeed, you can keep leetcode-cli and chrome both alive in the same time.

If failed, it will fall back to normal login to leetcode.com as before.


## Requirement

In short it's case by case since it varies on different platforms (Mac/Linux/Windows), different chrome versions, even different cookie encryption versions (v10/v11).

### Linux

Make sure `secret-tool` is available:

	$ sudo apt-get install libsecret-tools

### Windows

Make sure build environment is ready before installing plugin:

	$ npm install -g windows-build-tools
	$ npm config set msvs_version 2015 -g

## Config

* `profile`: chrome profile in use, default value is "Default".

*Set Config*

	$ leetcode config plugins:cookie.chrome:profile "Your Profile"

*Unset Config*

	$ leetcode config -d plugins:cookie.chrome

*Example*

	{
		"plugins": {
			"cookie.chrome": {
				"profile": "Profile 2"
			}
		}
	}

## Usage

If enabled, the login will try to reuse existing chrome cookies. You can verify it by printing debug output as below.

	$ leetcode user -l -v
	login: <you account>
	pass:
	[DEBUG] running cookie.chrome.login
	[DEBUG] running cookie.chrome.signin
	[DEBUG] try to copy leetcode cookies from chrome ...
	[DEBUG] Successfully copied leetcode cookies!
	[DEBUG] running leetcode.getFavorites
	Successfully login as <your account>

