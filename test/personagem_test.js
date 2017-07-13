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
        it('Should be at pos 666 when given in floor paramter, and personagemAltitude is 0', () => {
            personagemAltitude = 0
            personagem(666,ctxTest)
            personagemAltitude.should.be.equal(666)
        })

        it('relative pos should be 0, when not jumping and not falling', () => {
            jumping  = false
            canJump = false
            personagemAltitude = 999
            personagem(666,ctxTest)
            personagemAltitude.should.be.equal(666)
            canJump.should.be.true
        })        

        it('should update ctx with y greater than floor value when jumping', () => {
            jumping = true
            ctxTest.y = 0
            personagemAltitude = 0
            personagem(666,ctxTest)
            ctxTest.y.should.be.lessThan(666)
        })

        it('should set jumping as false when personagemAltitude hit maxJumpHeight', () => {
            personagemAltitude = floor - maxJumpHeight 
            jumping = true
            personagem(666,ctxTest)
            jumping.should.be.false

        })

        it('should update ctx with y lower than personagemAltitude given when not jumping and personagemAltitude gT floor', () => {
            personagemAltitude = 400
            jumpSpeed = 50
            jumping = false
            personagem(666,ctxTest)
            personagemAltitude.should.be.greaterThan(400)
        })

    })
})