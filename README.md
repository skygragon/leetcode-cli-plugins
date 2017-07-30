# leetcode-cli-plugins
3rd party plugins for leetcode-cli.

* [company.js](#company)
* [cpp.lint.js](#cpplint)
* [cpp.run.js](#cpprun)
* [solution.discuss](#solutiondiscuss)

## HOWTO

You can install the plugins in either ways below:

### Quick Install

    $ leetcode install <plugin file>

To manage the installed plugins, please check [leetcode-cli's user guide](https://skygragon.github.io/leetcode-cli/commands#plugin).

## Plugins

### Company

* use `list` + `-t` to filter by company.

Filter questions by company tag.

    $ leetcode list -q hL -t facebook

      [410] Split Array Largest Sum                                      Hard   (36.60 %)
    ✔ [301] Remove Invalid Parentheses                                   Hard   (35.03 %)
    ✔ [297] Serialize and Deserialize Binary Tree                        Hard   (33.12 %)
      [282] Expression Add Operators                                     Hard   (29.55 %)
      [273] Integer to English Words                                     Hard   (21.98 %)
      [218] The Skyline Problem                                          Hard   (27.00 %)
    ✔ [146] LRU Cache                                                    Hard   (17.53 %)
    ✔ [128] Longest Consecutive Sequence                                 Hard   (36.63 %)
    ✔ [ 85] Maximal Rectangle                                            Hard   (27.66 %)
    ✔ [ 76] Minimum Window Substring                                     Hard   (25.14 %)
    ✔ [ 68] Text Justification                                           Hard   (18.95 %)
    ✔ [ 57] Insert Interval                                              Hard   (27.46 %)
    ✔ [ 44] Wildcard Matching                                            Hard   (19.93 %)
    ✔ [ 25] Reverse Nodes in k-Group                                     Hard   (30.61 %)
    ✔ [ 23] Merge k Sorted Lists                                         Hard   (27.08 %)
    ✔ [ 10] Regular Expression Matching                                  Hard   (24.06 %)

### cpp.lint

Run cpplint to check c++ code syntax before running test.

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


### cpp.run

* use `test` + `--local` to test your code locally without asking leetcode.com.

Testing cpp code locally for debugging purpose.

    $ leetcode test 001.two-sum.cpp --local

    Input data:
    [3,2,4]
    6

    Testing locally ...

    [1,2]

### solution.discuss

* use `show` + `--solution` to display most voted solution.
* `-l java` to fetch java solution.

Fetch the most voted solution in discussion topics.

    $ leetcode show 1 --solution

    Accepted C++ O(n) Solution

    https://discuss.leetcode.com/topic/3294/accepted-c-o-n-solution

    * Lang:  cpp
    * Votes: 221

    vector<int> twoSum(vector<int> &numbers, int target)
    {
        //Key is the number and value is its index in the vector.
        unordered_map<int, int> hash;
        vector<int> result;
        for (int i = 0; i < numbers.size(); i++) {
            int numberToFind = target - numbers[i];

                //if numberToFind is found in map, return them
            if (hash.find(numberToFind) != hash.end()) {
                        //+1 because indices are NOT zero based
                result.push_back(hash[numberToFind] + 1);
                result.push_back(i + 1);
                return result;
            }

                //number was not found. Put it in the map.
            hash[numbers[i]] = i;
        }
        return result;
    }
