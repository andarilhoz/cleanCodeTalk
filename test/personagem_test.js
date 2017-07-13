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
        it('Should be at pos 666 when given in floor paramter, and actualPos is 0', () => {
            actualPos = 0
            personagem(666,ctxTest)
            actualPos.should.be.equal(666)
        })

        it('relative pos should be 0, when not jumping and not falling', () => {
            relativePos = 70
            jumping  = false
            podePula = false
            actualPos = 666
            personagem(666,ctxTest)
            relativePos.should.be.equal(0)
            podePula.should.be.true
            actualPos.should.be.equal(666)
        })        

        it('should update ctx with y greater than floor value when jumping', () => {
            jumping = true
            ctxTest.y = 0
            actualPos = 0
            personagem(666,ctxTest)
            ctxTest.y.should.be.lessThan(666)
        })

        it('should set jumping as false when actualPos hit maxJumpHeight', () => {
            actualPos = floor - maxJumpHeight 
            jumping = true
            personagem(666,ctxTest)
            jumping.should.be.false

        })

        it('should update ctx with y lower than actualPos given when not jumping and actualPos gT floor', () => {
            actualPos = 400
            jumpSpeed = 50
            jumping = false
            personagem(666,ctxTest)
            actualPos.should.be.greaterThan(400)
        })

    })
})