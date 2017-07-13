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
    describe('Personagem', () => {
        it('Should be at pos 666 when given in floor paramter, and Manager.personagemAltitude is 0', () => {
            Manager.personagemAltitude = 0
            personagem(666,ctxTest)
            Manager.personagemAltitude.should.be.equal(666)
        })

        it('relative pos should be 0, when not Manager.jumping and not falling', () => {
            Manager.jumping  = false
            Manager.canJump = false
            Manager.personagemAltitude = 999
            personagem(666,ctxTest)
            Manager.personagemAltitude.should.be.equal(666)
            Manager.canJump.should.be.true
        })        

        it('should update ctx with y greater than floor value when Manager.jumping', () => {
            Manager.jumping = true
            ctxTest.y = 0
            Manager.personagemAltitude = 0
            personagem(666,ctxTest)
            ctxTest.y.should.be.lessThan(666)
        })

        it('should set Manager.jumping as false when Manager.personagemAltitude hit maxJumpHeight', () => {
            Manager.personagemAltitude = floor - Manager.maxJumpHeight 
            Manager.jumping = true
            personagem(666,ctxTest)
            Manager.jumping.should.be.false

        })

        it('should update ctx with y lower than Manager.personagemAltitude given when not Manager.jumping and Manager.personagemAltitude gT floor', () => {
            Manager.personagemAltitude = 400
            Manager.jumpSpeed = 50
            Manager.jumping = false
            personagem(666,ctxTest)
            Manager.personagemAltitude.should.be.greaterThan(400)
        })

    })
})