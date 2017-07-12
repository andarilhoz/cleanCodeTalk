define(function(require){
    describe('App', () => {
        it('Sleep should be less than 10 miliseconds', async () => {
            let a = new Date()
            await sleep()
            let b = new Date()
            let timeout = b - a
            timeout.should.be.lessThan(10)
        })
    })

    describe('Collision checker', () => {
        it('Should return false when not colliding', () => {
            let colliding = checkForCollision(0,400,400)
            colliding.should.be.equal(false)
        })

        it('Should return true when collidin', () => {
            let colliding = checkForCollision(96,400,400)
            colliding.should.be.equal(true)
        })

        it('Should return false when not colliding (player jumping)', () => {
            let colliding = checkForCollision(96,330,400)
            colliding.should.be.equal(false)
        })
    })
})