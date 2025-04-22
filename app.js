const addNumbers = require('./generated_modules/addNumbers.js');


async function run() {
    const  { result } = addNumbers(1, 2);

    console.log("addNumbers result", result);
}

run();
// considerations of a spec based codebase:
/*
1. When do we generate the code? build time? deploy time? runtime? what are the tradeoffs?
2. Does the code gets commited to git? If it is, what is the flow for re-generating the code? when do we want it to be regenerated?
3. can we generate an entire codebase from specs?
*/