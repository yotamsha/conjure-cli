module.exports = {
    addNumbers: {
        specId: 'addNumbers',
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
    }
}