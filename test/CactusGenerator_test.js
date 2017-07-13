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
    Manager.canvas = {height: 400}
    describe('CactusGenerator', () => {
        it('should return 2 when used updatePos(2) and getPos()', () => {
            let cactusTest = new CactusGenerator()
            cactusTest.updatePos(2)
            cactusTest.getPos().should.be.equal(2)
        })

        it('should give individual pos to distinct instances', () => {
            let cactusFirstTest = new CactusGenerator()
            cactusFirstTest.updatePos(2)
            let cactusSecondTest = new CactusGenerator()
            cactusSecondTest.updatePos(3)

            cactusFirstTest.getPos().should.be.equal(2)
        })

        it('should set a number greater or equal than 200 to secondCactusPos', () => {
            for(i=0;i<=1000;i++){
                Manager.secondCactus.updatePos(0) 
                let a = Manager.secondCactus.getRandomSpawn()
                Manager.secondCactus.updatePos(a)
                Manager.secondCactus.getPos().should.be.greaterThan(199)
            }
        })
    })
})