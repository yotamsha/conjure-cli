module.exports = {
  "processUserData": {
    "specId": "processUserData",
    "description": "Process user data with validation, transformation, and filtering",
    "specifications": [
      {
        "description": "Validate user objects, transform their properties, and filter based on criteria",
        "sampleExpectations": [
          {
            "inputs": {
              "users": [
                { "id": 1, "name": "john doe", "age": 25, "email": "john@example.com", "active": true },
                { "id": 2, "name": "jane smith", "age": 17, "email": "jane@example.com", "active": true },
                { "id": 3, "name": "bob jones", "age": 32, "email": "invalid-email", "active": false }
              ],
              "options": {
                "minAge": 18,
                "activeOnly": true,
                "formatNames": true
              }
            },
            "output": {
              "validUsers": [
                { "id": 1, "name": "John Doe", "age": 25, "email": "john@example.com", "active": true }
              ],
              "invalidUsers": [
                { "id": 2, "reason": "User is under minimum age requirement" },
                { "id": 3, "reason": "User is not active and has invalid email format" }
              ],
              "stats": {
                "total": 3,
                "valid": 1,
                "invalid": 2
              }
            }
          }
        ]
      }
    ]
  }
}