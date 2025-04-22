# Spec-Based Functions

A library for creating and using AI-powered functions based on specifications.

## Overview

This project provides a framework for defining and executing functions that leverage AI models (specifically Google's Gemini) to perform tasks based on provided specifications. It allows you to create functions that can interpret natural language inputs and execute complex operations according to predefined specifications.

## Installation

```bash
npm install spec-based-functions
```

## Prerequisites

- Node.js (v14 or higher recommended)
- A Google AI API key (for Gemini model access)

## Getting Started

1. Set up your environment variables:

```bash
# Create a .env file in your project root
GOOGLE_API_KEY=your_api_key_here
```

2. Import and use the library:

```javascript
const { createSpecBasedFunction } = require('spec-based-functions');

// Define a function with a specification
const myFunction = createSpecBasedFunction({
  name: "calculateTotal",
  description: "Calculate the total price including tax and shipping",
  parameters: {
    items: "Array of items with price and quantity",
    taxRate: "Tax rate as a decimal",
    shippingCost: "Cost of shipping"
  }
});

// Use the function
const result = await myFunction({
  items: [
    { price: 10, quantity: 2 },
    { price: 15, quantity: 1 }
  ],
  taxRate: 0.08,
  shippingCost: 5
});

console.log(result);
```

## Features

- Create AI-powered functions with clear specifications
- Leverage Google's Gemini models for natural language understanding
- Define expected parameters and return values
- Handle complex operations with minimal code


## Security Considerations

This library uses Google's Generative AI SDK. As noted in their documentation:

> **CAUTION**: Using the Google AI SDK for JavaScript directly from a client-side app is recommended for prototyping only. If you plan to enable billing, we strongly recommend that you call the Google AI Gemini API only server-side to keep your API key safe.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.