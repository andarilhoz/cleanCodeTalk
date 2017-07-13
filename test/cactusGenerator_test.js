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

    describe('CactusGenerator', () => {
        it('should return 2 when used updatePos(2) and getPos()', () => {
            let cactusTest = new cactusGenerator()
            cactusTest.updatePos(2)
            cactusTest.getPos().should.be.equal(2)
        })

        it('should give individual pos to distinct instances', () => {
            let cactusFirstTest = new cactusGenerator()
            cactusFirstTest.updatePos(2)
            let cactusSecondTest = new cactusGenerator()
            cactusSecondTest.updatePos(3)

            cactusFirstTest.getPos().should.be.equal(2)
        })

        it('should set floor as canvas.height/2', () => {
            let cactusTest = new cactusGenerator()
            cactusTest.floor = 0
            cactusTest.update(ctxTest)
            cactusTest.floor.should.be.equal(canvas.height / 2)
        })
    })
})