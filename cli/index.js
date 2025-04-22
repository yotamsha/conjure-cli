#!/usr/bin/env node

const buildSpecs = require('./build');
const fs = require('fs');
const path = require('path');

// Define the commands and their descriptions
const commands = {
  build: 'Rebuild the code from the spec files and update the lock file',
  clean: 'Delete the generated code and the lock file',
  help: 'Display this help menu'
};

/**
 * Displays the help menu
 */
function showHelp() {
  console.log('\nSpec-Based Functions CLI\n');
  console.log('Usage: spec-functions <command> [options]\n');
  console.log('Commands:');
  
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(10)} ${desc}`);
  });
  
  console.log('\nOptions:');
  console.log('  --force       Force regeneration of all specs (with build command)');
  console.log('  --output=DIR  Specify output directory (with build command)');
}

/**
 * Cleans generated code and lock file
 * @param {string} outputDir Directory containing generated code
 * @param {string} lockFile Path to lock file
 */
function cleanGeneratedCode(outputDir = './generated_modules', lockFile = './code-lock.json') {
  try {
    // Delete the generated code directory
    if (fs.existsSync(outputDir)) {
      console.log(`Removing generated code directory: ${outputDir}`);
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    
    // Delete the lock file
    if (fs.existsSync(lockFile)) {
      console.log(`Removing lock file: ${lockFile}`);
      fs.unlinkSync(lockFile);
    }
    
    console.log('Clean completed successfully');
  } catch (error) {
    console.error('Error during clean operation:', error);
    process.exit(1);
  }
}

/**
 * Main function to process CLI commands
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Parse options
  const options = {};
  const remainingArgs = args.slice(1).filter(arg => {
    if (arg.startsWith('--force')) {
      options.force = true;
      return false;
    }
    if (arg.startsWith('--output=')) {
      options.outputDir = arg.split('=')[1];
      return false;
    }
    return true;
  });
  
  // Default output directory
  const outputDir = options.outputDir || './generated_modules';
  
  // Process commands
  switch (command) {
    case 'build':
      try {
        console.log('Building spec-based functions...');
        await buildSpecs('./', outputDir, { force: options.force });
        console.log('Build completed successfully');
      } catch (error) {
        console.error('Error during build:', error);
        process.exit(1);
      }
      break;
      
    case 'clean':
      cleanGeneratedCode(outputDir);
      break;
      
    case 'help':
    case undefined:
      showHelp();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Run the CLI
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});