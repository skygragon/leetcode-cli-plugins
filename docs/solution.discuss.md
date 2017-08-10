# solution.discuss

Fetch the most voted solution in discussion topics.

* `show` + `--solution` to display most voted solution.
* `-l java` to fetch java solution.

## Usage

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
