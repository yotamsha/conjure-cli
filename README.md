# Spec-Based Functions

A framework for generating and managing code based on specifications using AI.

## Project Vision

Spec-Based Functions enables a specification-first approach to software development. Instead of writing implementation code directly, you define what your functions should do using clear specifications. The system then leverages AI to generate the actual implementation code.

### Workflow

1. **Define Specifications**: Create spec files that describe your functions' behavior, including descriptions, requirements, and sample inputs/outputs.
2. **Generate Code**: Run the CLI tool to generate implementation code based on your specs.
3. **Track Changes**: The system maintains a lock file (`code-lock.json`) to track which specs have changed and only regenerates code when necessary.
4. **Use Generated Code**: Import and use the generated functions in your application.

This approach offers several benefits:
- Focuses development on defining clear requirements rather than implementation details
- Ensures consistent code generation based on specifications
- Maintains a clear connection between specifications and implementations

### Generated Code Versioning

The user can opt to commit the generated code to their repository. This allows for versioning and tracking of changes to the generated code. (Recommended)

# Install dependencies

```bash
npm install -g conjure-cli
```
### CLI Usage

The package includes a command-line interface with the following commands:

```bash
# Build or rebuild code from spec files
conjure build [--force] [--output=DIR]

# Delete generated code and lock file
conjure clean

# Display help menu
conjure help
```

Options:
- `--force`: Force regeneration of all specs, even if they haven't changed
- `--output=DIR`: Specify output directory for generated code (default: ./generated_modules)

### Creating Specifications

Create a spec file (should end with `.spec.def.js`, e.g. `functions.spec.def.js`) with the following structure:

```javascript
module.exports = {
  "uniqueFunctionName": {
    "specId": "uniqueFunctionName",
    "description": "Function description",
    "specifications": [
      {
        "description": "Detailed requirement",
        "sampleExpectations": [
          {
            "inputs": { "param1": "value1", "param2": "value2" },
            "output": "expectedResult"
          }
        ]
      }
    ]
  }
}
```

### Example

Check out the `examples` directory for a simple example of how to use spec-based functions.

## Requirements

- Node.js 18 or higher
- Google Gemini API key