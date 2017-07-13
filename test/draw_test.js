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
    Manager.canvasContext = ctxTest
    personagemTest = () => {
        this.called = false
    }

    describe('Draw', () => {
        it('should set canvas size', () => {
            Manager.canvas.width = 0
            draw(ctxTest)
            let widthDefined = Manager.canvas.width == window.innerWidth
            let heightDefined = Manager.canvas.height == window.innerHeight
            let sizeDefined = heightDefined && widthDefined 
            sizeDefined.should.be.equal(true)
        })
    })
})