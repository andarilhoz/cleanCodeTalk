define(function(require){
    describe('Sleep', () => {
        it('Should be less than 10 miliseconds', async () => {
            let a = new Date()
            await sleep()
            let b = new Date()
            let timeout = b - a
            timeout.should.be.lessThan(10)
        })
    })
})