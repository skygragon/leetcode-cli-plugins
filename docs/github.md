# github

Auto commit the accepted code to your own (public) GitHub repo.

## Config

* `repo`: your GitHub repo to persistent accpeted code.
* `token`: the access token to your repo, see [how to get token](#generate-token).

*Example*

	{
		"PLUGINS": {
			"github": {
				"repo": "https://github.com/skygragon/test",
				"token": "xxxxxxxxxxxxx"
			}
		}
	}

## Usage

	$ leetcode submit 001.two-sum.cpp
	  ✔ Accepted
	  ✔ 19/19 cases passed (6 ms)
	  ✔ Committed to https://github.com/skygragon/test
	  ✔ Your runtime beats 83.48 % of cpp submissions

## Tips

### Generate Token

As shown below, follow the steps:
`Settings` -> `Personal access tokens` -> `Generate new token` -> `public_repo` -> `Generate token`.

![token1](token.1.jpg)

![token2](token.2.jpg)