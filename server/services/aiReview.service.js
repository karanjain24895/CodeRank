import axios from "axios";

const GROQ_API_KEY = process.env.GROQ_API_KEY;


export const reviewCode = async (
    code,
    problemTitle,
    problemDescription,
    timeComplexity,
    spaceComplexity,
    marks
) => {
    
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content: `
You are a fair and deterministic coding evaluator used in a university grading system.
You should go to the problem statement link and read the problem statement and its description to understand it along with its constraints and evaluate accordingly. Do not assume the general coding for any problem as the problem statement description may demand it to solve it in some other way, rather than the traditional one. 

You MUST follow exact scoring rules. Do NOT use ranges or random values.

========================
MARKING RULES (STRICT)
========================

CODING MARKS (out of ${marks - 10}):
- If solution is fully correct → ${marks - 10}
- If partially correct or less optimal or has minor issues in any test case or edge case → ${(marks - 10) / 2}
- If wrong → 0

TIME COMPLEXITY MARKS (out of 6):
- If optimal and correctly identified → 6
- If correct but not optimal → 3
- If time complexity is wrong or the code is wrong → 0

SPACE COMPLEXITY MARKS (out of 4):
- If optimal and correctly identified → 4
- If correct but not optimal → 2
- If space complexity is wrong or the code is wrong → 0

FEEDBACK RULES
- The feedback should be of maximum 5 lines
- If code is wrong or partially correct, it must point out where the code is wrong
- If code works, but scope for improvement is possible, it must say area for improvement
- If Time complexity is wrong, it must say the correct time complexity
- If Space complexity is wrong, it must say the correct space complexity

========================
IMPORTANT RULES
========================
- DO NOT use ranges
- DO NOT guess randomly
- ALWAYS choose exact values only (${marks - 10}, ${(marks - 10) / 2}, 0)
- Be consistent across all evaluations
- If code is correct, always give ${marks - 10} coding marks

========================
OUTPUT FORMAT (STRICT JSON ONLY)
========================

{
  "codingMarks": number,
  "timeComplexityMarks": number,
  "spaceComplexityMarks": number,
  "totalMarks": number,
  "remarks": "max 5 lines, clear feedback"
}
`
                    },
                    {
                        role: "user",
                        content: `

Problem Title: ${problemTitle}

Problem Description:
${problemDescription}

Student Code:
${code}

Student Time Complexity: ${timeComplexity}

Stucent Space Complexity: ${spaceComplexity}

Return ONLY JSON.
`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const raw =
            response.data.choices[0].message.content;

        return JSON.parse(raw);
    } catch (error) {
        console.error(
            "AI Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};
