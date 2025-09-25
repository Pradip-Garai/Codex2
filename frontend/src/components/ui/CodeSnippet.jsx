import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeString = `
class Solution:
    def twoSum(self, nums, target):
        # Create a hashmap to store values and indices
        hashmap = {}

        for i, num in enumerate(nums):
            complement = target - num

            if complement in hashmap:
                return [hashmap[complement], i]

            hashmap[num] = i

        return []
`;

const CodeSnippet= () => {
  return (
    <div className="bg-[#0d0d0d] rounded-lg shadow-xl p-6 max-w-3xl mx-auto font-mono">
      {/* Mac-style dots */}
      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
      <SyntaxHighlighter
        language="python"
        style={dracula}
        customStyle={{
          background: '#0d0d0d',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '1rem',
        }}
        wrapLines
        showLineNumbers={false}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeSnippet;
