# cpp.lint

Run cpplint to check c++ code syntax before running `test` against leetcode.com.

## Requirement

* need install`cpplint.py`: [download](https://raw.githubusercontent.com/google/styleguide/gh-pages/cpplint/cpplint.py)

## Config

* `bin`: path of cpplint.py.
* `flags`: list to enable/disable checking options.
	* `+` to enable specific checking.
	* `-` to disable specific checking.

*Set Config*

	$ leetcode config plugins:cpp.lint:bin <path of cpplint>
	$ leetcode config plugins:cpp.lint:flags '["-whitespace/indent"]'

*Unset Config*

	$ leetcode config -d plugins:cpp.lint

*Example*

	{
		"plugins": {
			"cpp.lint": {
				"bin": "/usr/bin/cpplint.py",
				"flags": [
					"-whitespace/indent"
				]
			}
		}
	}

## Usage

    $ leetcode test 1.two-sum.cpp

    Input data:
    [3,2,4]
    6

    Running cpplint ...

    [ERROR] 1.two-sum.cpp:29:  public: should be indented +1 space inside class Solution  [whitespace/indent] [3]
    [ERROR] 1.two-sum.cpp:30:  Is this a non-const reference? If so, make const or use a pointer: vector<int>& nums  [runtime/references] [2]
    [ERROR] 1.two-sum.cpp:31:  Line ends in whitespace.  Consider deleting these extra spaces.  [whitespace/end_of_line] [4]
    [ERROR] 1.two-sum.cpp:31:  Redundant blank line at the start of a code block should be deleted.  [whitespace/blank_line] [2]
    [ERROR] 1.two-sum.cpp:31:  Redundant blank line at the end of a code block should be deleted.  [whitespace/blank_line] [3]
