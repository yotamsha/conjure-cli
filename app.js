// 

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config()
const { VM } = require('vm2');
const vm = new VM();

const specs = {
    123: {
        specId: '123',
        description: 'add 2 numbers',
        specifications: [{
            description: 'when getting 2 numbers, return the sum',
            sampleExpectations: [{
                inputs: {
                    a: 1,
                    b: 2
                },
                output: {
                    result: 3
                }
            }]
        }]
    },
    4321: {
        specId: '4321',
        description: 'merge two sorted arrays',
        specifications: [{
            description: 'when getting two sorted arrays, return a single sorted array',
            sampleExpectations: [{
                inputs: {
                    a: [1, 3, 5],
                    b: [2, 4, 6]
                },
                output: {
                    result: [1, 2, 3, 4, 5, 6]
                }
            }]
        }]
    }
}

async function act(functionSpecId, ...args) {
    const spec = specs[functionSpecId];
    console.log("acting on spec", spec);
    
    if (!spec) {
        console.error(`Specification with ID ${functionSpecId} not found`);
        return null;
    }
    
    // Generate code based on the specification
    const code = await generateCode(spec);
    
    // Execute the generated code with sample inputs
    const result = await executeCode(code, ...args);
    
    return result;
}

function generateCode(spec) {
    console.log("Generating code using Gemini API for spec:", spec.description);
    
    // This would be an async function in a real implementation
    // For demonstration, using a synchronous approach
    
    // Construct the prompt for Gemini
    const prompt = constructGeminiPrompt(spec);
    
    // Call Gemini API (mock implementation)
    const generatedCode = callGeminiAPI(prompt);
    
    return generatedCode;
}

function constructGeminiPrompt(spec) {
    // Create a detailed prompt based on the specification
    return `Generate JavaScript code for a function named 'calculate' that:
- Description: ${spec.description}
- Detailed requirements: ${spec.specifications.map(s => s.description).join('\n')}
- Sample inputs/outputs: ${JSON.stringify(spec.specifications.flatMap(s => s.sampleExpectations))}
- The function should take parameters matching the sample inputs
- Return an object with properties matching the sample outputs
- The function should be named 'calculate'
- IMPORTANT: Return ONLY the JavaScript code without any markdown formatting, code block syntax, or explanations. Do not include \`\`\`javascript or \`\`\` tags.`;
}

async function callGeminiAPI(prompt) {
    try {
        
        // Initialize the Gemini API with your API key
        // In production, use environment variables for the API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Get the Gemini Pro model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Received response from Gemini API:", text);
        return text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Fallback response in case of error
        return null;
    }
}

function executeCode(code, ...args) {
    console.log("Executing code with args:", args, code);
    // evaluate function and add a self invoking function with the invocation of the calculate function with the args:
    const response = vm.run(`(${code})(${args.map(arg => JSON.stringify(arg)).join(',')})`);
    console.log("Executed code with result:", response);
    return response.result;
}

async function combineActs() {
    const result1 = await act('123', 1, 2);
    const result2 = await act('123', result1, 3);
    return result2;
}
async function run() {
    console.log("run");
    const result  =  await combineActs();
    console.log("last result", result);
}

run();
// considerations of a spec based codebase:
/*
1. When do we generate the code? build time? deploy time? runtime? what are the tradeoffs?
2. Does the code gets commited to git? If it is, what is the flow for re-generating the code? when do we want it to be regenerated?
3. can we generate an entire codebase from specs?
*/