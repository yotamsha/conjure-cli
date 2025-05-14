const processUserData = require('./generated_modules/processUserData.js');

async function run() {
    const users = [
        { "id": 1, "name": "john doe", "age": 25, "email": "john@example.com", "active": true },
        { "id": 2, "name": "jane smith", "age": 17, "email": "jane@example.com", "active": true },
        { "id": 3, "name": "bob jones", "age": 32, "email": "invalid-email", "active": false },
        { "id": 4, "name": "alice cooper", "age": 29, "email": "alice@example.com", "active": true }
    ];

    const options = {
        minAge: 18,
        activeOnly: true,
        formatNames: true
    };

    const result = processUserData(users, options);

    console.log("Valid Users:", result.validUsers);
    console.log("Invalid Users:", result.invalidUsers);
    console.log("Stats:", result.stats);
}

run();