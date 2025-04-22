const addNumbers = require('./generated_modules/addNumbers.js');

async function run() {
    const  { result } = addNumbers(1, 2);

    console.log("addNumbers result", result);
}

run();
// considerations of a spec based codebase:
/*
1. When do we generate the code? build time? deploy time? runtime? what are the tradeoffs?
- It seems to me that the code should be generated at build time. This way, we can have a consistent codebase that is easy to test and deploy.
- We can treat this code as if it came from the node_modules folder. (with the difference that the modules do get committed in order to prevent redundant generation on every CI build)
2. Does the code gets commited to git? If it is, what is the flow for re-generating the code? when do we want it to be regenerated?
3. can we generate an entire codebase from specs?

Open Issues:
- what happens if a user deletes the generated code or lock file and decides to re-generate it? Due to the nature of the code generation, it is possible that the code will be different.
- in order to mitigate the issue we can have a set of tests which are part of the codebase and will fail if the code is not generated correctly.
- also, having the code committed let us track changes to the code (in some cases, a new model might generate different code which is more performant)
*/