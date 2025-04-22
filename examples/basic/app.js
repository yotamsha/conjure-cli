const addNumbers = require('./generated_modules/addNumbers.js');

async function run() {
    const  { result } = addNumbers(1, 2);

    console.log("addNumbers result", result);
}

run();