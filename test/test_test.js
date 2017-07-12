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

    describe('On space keyup', () => {
        it('should set jumping equals true', () => {
            jumping = false
            onSpace()
            jumping.should.be.equal(true)
        })

        it('should not change jumping state if its true', () => {
            jumping = true
            onSpace()
            jumping.should.be.equal(true)
        })

        it('should set podPula as false', () => {
            podePula = true
            onSpace()
            podePula.should.be.equal(false)
        })

        it('should set gameOver as false when gameOver is true', () => {
            gameOver = true
            fn = () => {}
            onSpace(fn)
            gameOver.should.be.equal(false) 
        })

        it('should set jumping to false when gameOver is true', () => {
            jumping = true
            gameOver = true
            fn = () => {}
            onSpace(fn)
            jumping.should.be.equal(false)
        })

        it('should set actualPos to 0 when gameOver is true', () => {
            actualPos = 500
            gameOver = true
            fn = () => {}
            onSpace(fn)
            actualPos.should.be.equal(0)
        })

        it('should change high score if difference val is greater and gameOver is true', () => {
            localStorage.setItem('HighScore',0)
            gameOver = true
            difference = 10
            fn = () => {}
            onSpace(fn)
            parseInt(HighScore).should.be.equal(10)            
        })

        it('should reset date when gameOver is true', async () => {
            gameOver = true
            await sleepTest(100)
            fn = () => {}
            onSpace(fn)
            let dateTest = new Date()
            let differenceBetweenDates = dateTest - date
            differenceBetweenDates.should.be.lessThan(10)
        })

        it('should execute callback when given and gameOver is true', (done) => {
            gameOver = true
            fn = () => {done()}
            onSpace(fn)
        })

    })

    function sleepTest(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
})