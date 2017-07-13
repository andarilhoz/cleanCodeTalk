define(function(require){
    Manager.player = new Player()
    describe('On space keyup', () => {
        it('should set jumping equals true', () => {
            Manager.player.jumping = false
            onSpace()
            Manager.player.jumping.should.be.equal(true)
        })

        it('should not change jumping state if its true', () => {
            Manager.player.jumping = true
            onSpace()
            Manager.player.jumping.should.be.equal(true)
        })

        it('should set canJump as false', () => {
            Manager.player.canJump = true
            onSpace()
            Manager.player.canJump.should.be.equal(false)
        })

        it('should set gameOver as false when gameOver is true', () => {
            Manager.gameOver = true
            fn = () => {}
            onSpace(fn)
            Manager.gameOver.should.be.equal(false) 
        })

        it('should set jumping to false when gameOver is true', () => {
            Manager.player.jumping = true
            Manager.gameOver = true
            fn = () => {}
            onSpace(fn)
            Manager.player.jumping.should.be.equal(false)
        })

        it('should set actualPos to 0 when gameOver is true', () => {
            Manager.player.personagemAltitude = 500
            Manager.gameOver = true
            fn = () => {}
            onSpace(fn)
            Manager.player.personagemAltitude.should.be.equal(0)
        })

        it('should change high score if difference val is greater and gameOver is true', () => {
            localStorage.setItem('HighScore',0)
            Manager.gameOver = true
            Manager.timeInSecondsSinceStart = 10
            fn = () => {}
            onSpace(fn)
            parseInt(Manager.highScore).should.be.equal(10)            
        })

        it('should reset date when gameOver is true', async () => {
            Manager.gameOver = true
            await sleepTest(100)
            fn = () => {}
            onSpace(fn)
            let dateTest = new Date()
            let differenceBetweenDates = dateTest - Manager.initialGameTime
            differenceBetweenDates.should.be.lessThan(10)
        })

        it('should execute callback when given and gameOver is true', (done) => {
            Manager.gameOver = true
            fn = () => {done()}
            onSpace(fn)
        })

    })

    function sleepTest(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
})