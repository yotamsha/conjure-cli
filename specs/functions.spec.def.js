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
    },
    mergeSortedArrays: {
        specId: 'mergeSortedArrays',
        description: 'merge two sorted arrays',
        specifications: [{
            description: 'when getting two sorted arrays, return a single sorted array!',
            sampleExpectations: [{
                inputs: {
                    a: [1, 3, 7],
                    b: [2, 4, 6]
                },
                output: {
                    result: [1, 2, 3, 4, 6, 7]
                }
            }]
        }]
    }
}