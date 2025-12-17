import { DataSource } from 'typeorm';
import { Problem } from '../entities/problem.entity';

export const seedProblems = async (dataSource: DataSource) => {
  const problemRepository = dataSource.getRepository(Problem);

  const problems = [
    {
      title: 'Maximum Subarray Sum',
      slug: 'maximum-subarray-sum',
      description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.`,
      difficulty: 'medium',
      asked_in_iitk_year: 2023,
      asked_by_company: 'Google',
      test_cases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
        { input: '[1]', output: '1' },
        { input: '[5,4,-1,7,8]', output: '23' },
      ],
      boilerplate_code: {
        python: `def maxSubArray(nums):
    # Your code here
    pass`,
        cpp: `int maxSubArray(vector<int>& nums) {
    // Your code here
}`,
        java: `public int maxSubArray(int[] nums) {
    // Your code here
}`,
      },
    },
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
      difficulty: 'easy',
      asked_in_iitk_year: 2022,
      asked_by_company: 'Amazon',
      test_cases: [
        { input: '[2,7,11,15]\n9', output: '[0,1]' },
        { input: '[3,2,4]\n6', output: '[1,2]' },
        { input: '[3,3]\n6', output: '[0,1]' },
      ],
      boilerplate_code: {
        python: `def twoSum(nums, target):
    # Your code here
    pass`,
        cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`,
        java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
}`,
      },
    },
    {
      title: 'Binary Tree Level Order Traversal',
      slug: 'binary-tree-level-order-traversal',
      description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

Example:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]`,
      difficulty: 'medium',
      asked_in_iitk_year: 2023,
      asked_by_company: 'Microsoft',
      test_cases: [
        { input: '[3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
        { input: '[1]', output: '[[1]]' },
        { input: '[]', output: '[]' },
      ],
      boilerplate_code: {
        python: `def levelOrder(root):
    # Your code here
    pass`,
        cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    // Your code here
}`,
        java: `public List<List<Integer>> levelOrder(TreeNode root) {
    // Your code here
}`,
      },
    },
    {
      title: 'Longest Palindromic Substring',
      slug: 'longest-palindromic-substring',
      description: `Given a string s, return the longest palindromic substring in s.

Example:
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.`,
      difficulty: 'medium',
      asked_in_iitk_year: 2022,
      asked_by_company: 'Goldman Sachs',
      test_cases: [
        { input: '"babad"', output: '"bab"' },
        { input: '"cbbd"', output: '"bb"' },
        { input: '"a"', output: '"a"' },
      ],
      boilerplate_code: {
        python: `def longestPalindrome(s):
    # Your code here
    pass`,
        cpp: `string longestPalindrome(string s) {
    // Your code here
}`,
        java: `public String longestPalindrome(String s) {
    // Your code here
}`,
      },
    },
    {
      title: 'Merge k Sorted Lists',
      slug: 'merge-k-sorted-lists',
      description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]`,
      difficulty: 'hard',
      asked_in_iitk_year: 2023,
      asked_by_company: 'Uber',
      test_cases: [
        { input: '[[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
        { input: '[]', output: '[]' },
        { input: '[[]]', output: '[]' },
      ],
      boilerplate_code: {
        python: `def mergeKLists(lists):
    # Your code here
    pass`,
        cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    // Your code here
}`,
        java: `public ListNode mergeKLists(ListNode[] lists) {
    // Your code here
}`,
      },
    },
  ];

  for (const problemData of problems) {
    const exists = await problemRepository.findOne({
      where: { slug: problemData.slug },
    });

    if (!exists) {
      const problem = problemRepository.create(problemData);
      await problemRepository.save(problem);
      console.log(`✅ Added problem: ${problemData.title}`);
    }
  }

  console.log('🎉 Problems seeded successfully!');
};