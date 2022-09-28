export const testAction = (action, payload, state, expectedMutations, done) => {
    let count = 0
    // mock commit
    const commit = (type, payload) => {
        const mutation = expectedMutations[count]

        try {
            expect(type).toEqual(mutation.type)
            expect(payload).toStrictEqual(mutation.payload)
        } catch (error) {
            done(error)
        }

        count++
        if (count >= expectedMutations.length) {
            done()
        }
    }
    // call the action with mocked store and arguments
    action({ commit, state }, payload)
    // check if no mutations should have been dispatched
    if (expectedMutations.length === 0) {
        expect(count).to.equal(0)
        done()
    }
}