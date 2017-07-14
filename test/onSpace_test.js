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

        it('should change high score if difference val is greater and gameOver is true', () => {
            localStorage.setItem('HighScore',0)
            Manager.gameOver = true
            Manager.timeInSecondsSinceStart = 10
            fn = () => {}
            onSpace(fn)
            parseInt(Manager.highScore).should.be.equal(10)            
        })

    })

    function sleepTest(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
})