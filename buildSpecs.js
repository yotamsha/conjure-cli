// a function which takes all the spec files and generates the code according to the specs.
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const LockManager = require('./lockManager');
require('dotenv').config();

/**
 * Finds all spec definition files in the given directory
 * @param {string} dir Directory to search
 * @returns {Array} Array of file paths
 */
function findSpecFiles(dir = './specs') {
  let results = [];
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(findSpecFiles(itemPath));
    } else if (item.endsWith('.spec.def.js')) {
      results.push(itemPath);
    }
  });
  
  return results;
}

/**
 * Constructs a prompt for the AI model based on the spec
 * @param {Object} spec Specification object
 * @returns {string} Prompt for the AI model
 */
function constructPrompt(spec) {
  return `Generate JavaScript code for a function named 'run' that:
- Description: ${spec.description}
- Detailed requirements: ${spec.specifications.map(s => s.description).join('\n')}
- Sample inputs/outputs: ${JSON.stringify(spec.specifications.flatMap(s => s.sampleExpectations))}
- The function should take parameters matching the sample inputs
- Return an object with properties matching the sample outputs
- The function should be named 'run'
- IMPORTANT: Return ONLY the JavaScript code without any markdown formatting, code block syntax, or explanations. Do not include \`\`\`javascript or \`\`\` tags.`;
}

/**
 * Removes markdown code block syntax if present
 * @param {string} code Generated code
 * @returns {string} Clean code without markdown syntax
 */
function cleanCodeBlockSyntax(code) {
  // Remove ```javascript at the beginning and ``` at the end if they exist
  return code.replace(/^```javascript\n/, '').replace(/\n```$/, '');
}

/**
 * Generates code using the AI model
 * @param {Object} spec Specification object
 * @returns {Promise<string>} Generated code
 */
async function generateCode(spec) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = constructPrompt(spec);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the code to remove any markdown syntax
    const cleanedCode = cleanCodeBlockSyntax(text);
    
    return cleanedCode;
  } catch (error) {
    console.error(`Error generating code for spec ${spec.specId}:`, error);
    return null;
  }
}

/**
 * Validates the generated code by testing it with sample inputs
 * @param {string} code Generated code
 * @param {Object} spec Specification object
 * @returns {boolean} Whether the code passes all tests
 */
function validateCode(code, spec) {  
  try {
    for (const specItem of spec.specifications) {

      for (const expectation of specItem.sampleExpectations) {

        const inputs = expectation.inputs;
        const expectedOutput = expectation.output;
        console.log("code", code);
        const args = Object.values(inputs);
        const response = eval(`(${code})(${args.map(arg => JSON.stringify(arg)).join(',')})`);
        console.log("response", response);
        console.log("expectedOutput", expectedOutput);
        // Compare result with expected output
        if (JSON.stringify(response) !== JSON.stringify(expectedOutput)) {
          console.error(`Validation failed for spec ${spec.specId}:`, {
            inputs,
            expected: expectedOutput,
            actual: response
          });
          return false;
        } else {
          console.log(`Validation passed for spec ${spec.specId} with inputs:`, inputs);
        }
      }
    }
    return true;
  } catch (error) {
    console.error(`Error validating code for spec ${spec.specId}:`, error);
    return false;
  }
}

/**
 * Builds code for all specs and writes to output directory
 * @param {string} specsDir Directory containing spec files
 * @param {string} outputDir Directory to write generated code
 * @param {Object} options Additional options
 * @param {boolean} options.force Force regeneration of all specs
 */
async function buildSpecs(specsDir = './specs', outputDir = './generated', options = {}) {
  const { force = false } = options;
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const specFiles = findSpecFiles(specsDir);
  console.log(`Found ${specFiles.length} spec files`);
  
  // Initialize lock manager
  const lockManager = new LockManager('./code-lock.json');
  
  // Track newly generated checksums
  const newChecksums = {};
  
  for (const filePath of specFiles) {
    try {
      const specs = require(path.resolve(filePath));
      
      for (const [_, spec] of Object.entries(specs)) {
        if (!spec.specId) {
          console.warn(`Spec without specId found in ${filePath}, skipping`);
          continue;
        }
        
        // Generate checksum for the spec
        const hash = lockManager.generateChecksum(spec);
        newChecksums[spec.specId] = hash;
        
        const outputPath = path.join(outputDir, `${spec.specId}.js`);
        
        // Skip if the spec hasn't changed and force flag is not set
        if (!force && !lockManager.hasSpecChanged(spec, outputPath)) {
          console.log(`Spec ${spec.specId} unchanged, skipping`);
          continue;
        }
        
        console.log(`\n --------- Generating code for spec ${spec.specId} ------------- \n`);
        const code = await generateCode(spec);
        
        if (!code) {
          console.error(`Failed to generate code for spec ${spec.specId}`);
          continue;
        }
        
        // Validate the generated code
        if (validateCode(code, spec)) {
          // Write the generated code to a file
          fs.writeFileSync(outputPath, `// Generated from spec ${spec.specId}\n// ${spec.description}\n\nmodule.exports = ${code};\n`);
          console.log(`Successfully generated code for spec ${spec.specId}`);
        } else {
          console.error(`Generated code for spec ${spec.specId} failed validation`);
        }
      }
    } catch (error) {
      console.error(`Error processing spec file ${filePath}:`, error);
    }
  }
  
  // Update the code-lock.json file
  lockManager.updateChecksums(newChecksums);
  console.log('Updated code-lock.json file');
}

module.exports = buildSpecs;

// If this file is run directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  
  buildSpecs('./specs', './generated_modules', { force }).catch(error => {
    console.error('Error building specs:', error);
    process.exit(1);
  });
}
