# lintcode (WIP)

Plugin to provide `lintcode-cli` to work with lintcode.com.

Support similar commands as leetcode:

* `list`
* `show`
* `test`
* `submit`
* `user`

## NOTE

1. when enabled, it will hide existing leetcode plugin, thus everything is working against lintcode.com (including user/problems cache, etc).
2. lintcode.com itself seems has bug in running test? The expected answer returned is not right!

## Usage

### list

	$ leetcode list -q e array
    ✔ [548] Intersection of Two Arrays II                                Easy   (21.00 %)
    ✔ [547] Intersection of Two Arrays                                   Easy   (23.00 %)
    ✔ [373] Partition Array by Odd and Even                              Easy   (41.00 %)
    ✔ [177] Convert Sorted Array to Binary Search Tree With Minimal Height Easy   (32.00 %)
    ✔ [138] Subarray Sum                                                 Easy   (30.00 %)
    ✔ [101] Remove Duplicates from Sorted Array II                       Easy   (30.00 %)
    ✔ [100] Remove Duplicates from Sorted Array                          Easy   (31.00 %)
    ✔ [ 64] Merge Sorted Array                                           Easy   (34.00 %)
    ✔ [ 50] Product of Array Exclude Itself                              Easy   (27.00 %)
    ✔ [ 44] Minimum Subarray                                             Easy   (38.00 %)
    ✔ [ 41] Maximum Subarray                                             Easy   (39.00 %)
    ✔ [ 39] Recover Rotated Sorted Array                                 Easy   (27.00 %)
    ✔ [  6] Merge Two Sorted Arrays                                      Easy   (36.00 %)

### show

	$ leetcode show 6 -gx
	[6] Merge Two Sorted Arrays

	http://www.lintcode.com/en/problem/merge-two-sorted-arrays/

	* lintcode
	* Easy (36.00%)
	* Source Code:       6.merge-two-sorted-arrays.cpp
	* Testcase Example:  '[1]\n[1]\n'

	Merge two given sorted integer array A and B into a new sorted integer array.
	Example
	A=[1,2,3,4]
	B=[2,4,5,6]
	return [1,2,2,3,4,4,5,6]
	Challenge
	How can you optimize your algorithm if one array is very large and the other is very small?

### test

	$ leetcode test 6.merge-two-sorted-arrays.cpp

	Input data:
	[1]
	[1]


	Actual
	  ✔ runtime: 11 ms
	  ✔ answer: '[1,1]'
	  ✔ stdout: ''

	Expected
	  ✔ answer: '[1,1]'
	  ✔ stdout: ''

### submit

	$ leetcode submit 6.merge-two-sorted-arrays.cpp
	  ✔ Accepted
	  ✔ 11/11 cases passed (162 ms)
	[WARN] Failed to get submission beat ratio.