define(function(require){
    ctxTest = {
        fillStyle: '',
        fillRect: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        strokeStyle: '',
        strokeRect: () => {},
        fillText: () => {}
    }
    firstCactusTest = {
        pos: 0,
        getPos: function() { return this.pos},
        updatePos: function(pos) {this.pos = pos},
        update: () => {}
    }
    secondCactusTest = {
        pos: 0,
        getPos: function() { return this.pos},
        updatePos: function(pos) {this.pos = pos},
        update: () => {}
    }
    
    personagemTest = () => {
        this.called = false
    }

    describe('Draw', () => {
        it('should set canvas size', () => {
            canvas.width = 0
            draw(ctxTest,personagemTest,firstCactusTest,secondCactusTest)
            let widthDefined = canvas.width == window.innerWidth
            let heightDefined = canvas.height == window.innerHeight
            let sizeDefined = heightDefined && widthDefined 
            sizeDefined.should.be.equal(true)
        })

        it('should set a number greater or equal than 200 to firstCactusPos', () => {
            for(i=0;i<=1000;i++){
                firstCactusTest.updatePos(0)
                secondCactusTest.updatePos(0)
                draw(ctxTest,personagemTest,firstCactusTest,secondCactusTest,i)
                firstCactusTest.getPos().should.be.greaterThan(199)
            }
        })

        it('should set a number greater or equal than 400 to secondCactusPos', () => {
            for(i=0;i<=1000;i++){
                firstCactusTest.updatePos(0)
                secondCactusTest.updatePos(0) 
                draw(ctxTest,personagemTest,firstCactusTest,secondCactusTest,i)
                secondCactusTest.getPos().should.be.greaterThan(399)
            }
        })


    })
})