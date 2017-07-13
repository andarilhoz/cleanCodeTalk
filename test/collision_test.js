define(function(require){
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