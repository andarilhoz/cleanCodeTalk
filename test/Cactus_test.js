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
    describe('Cactus', () => {
        it('should give individual pos to distinct instances', () => {
            let cactusFirstTest = new Cactus()
            cactusFirstTest.pos = 2
            let cactusSecondTest = new Cactus()
            cactusSecondTest.pos = 3

            cactusFirstTest.pos.should.be.equal(2)
        })

        it('should set a number greater or equal than 200 to secondCactusPos', () => {
            for(i=0;i<=1000;i++){
                Manager.secondCactus.pos = 0
                let a = Manager.secondCactus.getRandomSpawn()
                Manager.secondCactus.pos = a
                Manager.secondCactus.pos.should.be.greaterThan(199)
            }
        })
    })
})