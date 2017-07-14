define(function(require){
    ctxTest = {
        y: 0,
        fillStyle: '',
        fillRect: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        strokeStyle: '',
        strokeRect: function(x,y,w,h) {
            this.x = x
            this.y = y
            this.w = w
            this.h = h
        },
        fillText: () => {}
    }
    Manager.player  = new Player ()
    describe('Personagem ', () => {
        it('Should be at pos 666 when given in floor paramter, and personagemAltitude is 0', () => {
            let playerWidthSize = 15
            Manager.floor = 666
            for(var i = 0;i<100;i++)
                Manager.player.update()
            Manager.player.jumping = false
            Manager.player.personagemAltitude.should.be.equal(666+ playerWidthSize)
        })

        it('relative pos should be 0, when not jumping and not falling', () => {
            let playerWidthSize = 15
            Manager.player.jumping  = false
            Manager.player.canJump = false
            Manager.floor = 666
            Manager.player.personagemAltitude = 999
            Manager.player.update()
            Manager.player.personagemAltitude.should.be.equal(666 + playerWidthSize)
            Manager.player.canJump.should.be.true
        })        

        it('should update ctx with y greater than floor value when jumping', () => {
            Manager.player.jumping = true
            ctxTest.y = 0
            Manager.player.personagemAltitude = 0
            Manager.player.update()
            ctxTest.y.should.be.lessThan(666)
        })

        it('should set jumping as false when personagemAltitude hit maxJumpHeight', () => {
            Manager.player.personagemAltitude = Manager.floor - Manager.player.maxJumpHeight 
            Manager.player.jumping = true
            Manager.player.update()
            Manager.player.jumping.should.be.false

        })

        it('should update ctx with y lower than personagemAltitude given when not jumping and personagemAltitude gT floor', () => {
            Manager.player.personagemAltitude = 400
            Manager.player.jumpSpeed = 50
            Manager.player.jumping = false
            draw()
            Manager.player.update()
            Manager.player.personagemAltitude.should.be.greaterThan(400)
        })

    })
})