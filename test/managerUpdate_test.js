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
    Manager.canvas = {
        width: 200,
        height: 200
    }
    describe('Draw', () => {
        it('should set canvas size', () => {
            Manager.canvas.width = 0
            updateManagerScreenVariables()
            let widthDefined = Manager.canvas.width == window.innerWidth
            let heightDefined = Manager.canvas.height == window.innerHeight
            let sizeDefined = heightDefined && widthDefined 
            sizeDefined.should.be.equal(true)
        })
    })
})