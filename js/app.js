Manager = function () {
  let canvas = document.querySelector('#canvas') || { getContext: function () { return null } }
  let canvasContext = canvas.getContext('2d')
  let initialGameTime = new Date()
  let timeInSecondsSinceStart = 0
  let sleepTime = 20
  let gameOver = false
  let highScore = localStorage.getItem('HighScore')
  let floor = canvas.height / 2
  let horizontalSplitScreen = canvas.width / 2
  let firstCactus
  let secondCactus
  let player

  return {
    canvas,
    canvasContext,
    initialGameTime,
    timeInSecondsSinceStart,
    sleepTime,
    gameOver,
    highScore,
    firstCactus,
    secondCactus,
    floor,
  }
}();

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { onSpace(loop) }
})

function onSpace(loop) {
  if (Manager.player.canJump && !Manager.gameOver)
    Manager.player.jumping = true
  if (Manager.gameOver) {
    Manager.player.jumping = false
    Manager.player.personagemAltitude = 0
    Manager.gameOver = false

    if (localStorage.getItem('HighScore') < Manager.timeInSecondsSinceStart) { 
      localStorage.setItem('HighScore', Manager.timeInSecondsSinceStart) 
    }

    Manager.highScore = localStorage.getItem('HighScore')
    Manager.initialGameTime = new Date()
    loop()
  }

  Manager.player.canJump = false
}

async function loop() {
  Manager.firstCactus = new CactusGenerator()
  Manager.secondCactus = new CactusGenerator()
  Manager.player = new Player()

  while (!Manager.gameOver) {
    let currentGameTime = new Date()
    Manager.floor = canvas.height / 2
    Manager.horizontalSplitScreen = canvas.width / 2
    Manager.timeInSecondsSinceStart = Math.floor((currentGameTime - Manager.initialGameTime) / 1000)
    
    draw(Manager.canvasContext)
    Manager.player.update()
    Manager.firstCactus.update()
    Manager.secondCactus.update()     

    await sleep(Manager.sleepTime)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function draw() {
  let playerFloorCorrection = Manager.floor -5

  Manager.canvas.width = window.innerWidth
  Manager.canvas.height = window.innerHeight

  drawFloor()
  drawBackGround()
  drawGUI()  
 
  drawCactus(Manager.firstCactus.getPos())
  drawCactus(Manager.secondCactus.getPos())
  drawPlayer(Manager.player.personagemAltitude)

}

function drawFloor(){
  Manager.canvasContext.lineWidth = 5
  Manager.canvasContext.strokeStyle = 'yellow'
  Manager.canvasContext.moveTo(30, Manager.floor + 70)
  Manager.canvasContext.lineTo(Manager.canvas.width - 30, Manager.floor + 70)
  Manager.canvasContext.stroke()
}

function drawBackGround(){
  Manager.canvasContext.fillStyle = 'Grey'
  Manager.canvasContext.fillRect(10, 10, Manager.canvas.width - 20, Manager.canvas.height - 20)
  Manager.canvasContext.stroke()
}

function drawGUI() {
  Manager.canvasContext.lineWidth = 1
  Manager.canvasContext.fillStyle = 'black'
  Manager.canvasContext.font = '30px Arial'
  Manager.canvasContext.fillText('Time: ' + Manager.timeInSecondsSinceStart, Manager.horizontalSplitScreen - 200, 100)

  Manager.canvasContext.fillText('HighScore: ' + Manager.highScore, Manager.horizontalSplitScreen, 100)
}

function drawCactus(pos) {
    Manager.canvasContext.strokeStyle = 'green'
    Manager.canvasContext.lineWidth = 3
    Manager.canvasContext.strokeRect(pos, Manager.floor, 30, 70)
}

function drawPlayer(verticalPos){
    Manager.canvasContext.strokeStyle = 'red'
    Manager.canvasContext.lineWidth = 5
    Manager.canvasContext.strokeRect(50, verticalPos, 50, 50)
}


function Player() {
  let jumping = false
  let playerSpeed = 5
  let maxJumpHeight = 250
  let canJump = true
  let personagemAltitude = Manager.floor
  let jumpSpeed = 50
  let relativePos = (Manager.floor - this.personagemAltitude)
  let playerFloor;

  function update() {
    let playerFloorCorrection = Manager.floor + 15
    this.personagemAltitude = this.personagemAltitude || Manager.floor
    let jumpSpeedFixed = this.jumpSpeed > 0 ? this.jumpSpeed -= 35 : 1
    
    this.relativePos = (Manager.floor - this.personagemAltitude)
    
    let playerIsJumping = this.jumping && this.relativePos <= this.maxJumpHeight
    let playerIsFalling = playerFloorCorrection > this.personagemAltitude && !this.jumping
    let playerIsIdle = !this.jumping
    
    if (playerIsJumping) {
      this.personagemAltitude -= jumpSpeedFixed
    } else if (playerIsFalling) {
      this.personagemAltitude += jumpSpeedFixed
    } else if (playerIsIdle) {
      this.personagemAltitude = playerFloorCorrection 
      this.canJump = true
      this.relativePos = (playerFloorCorrection - this.personagemAltitude)
    }
    
    if (this.relativePos >= this.maxJumpHeight)  
      this.jumping = false 
    
    this.jumpSpeed = 50

  }
  return {
    jumping,
    playerSpeed,
    maxJumpHeight,
    personagemAltitude,
    canJump,
    jumpSpeed,
    relativePos,
    update
  }
}

function CactusGenerator() {
  let pos = 0

  function updatePos(val) {
    this.pos = val
  }
  function getPos() {
    return this.pos
  }

  function getRandomSpawn(seed) {
    let minimumDistanceFromPlayer = 200
    let width = Manager.canvas.width || minimumDistanceFromPlayer
    return Math.floor(Math.random() * (width - minimumDistanceFromPlayer) + minimumDistanceFromPlayer)
  }

  function update() {
    if (this.getPos() <= 0) {
      this.updatePos(this.getRandomSpawn())
    }

    this.pos = this.pos || getRandomSpawn(new Date())
    this.pos -= Manager.player.playerSpeed 

    if (checkForCollision(this.pos, Manager.player.personagemAltitude, Manager.floor)) {
      Manager.gameOver = true
    }
  }
  return {
    getPos,
    updatePos,
    update,
    getRandomSpawn
  }
}

function checkForCollision(objectFace, pos, floor) {
  let playerIsAtCactusHightRange = pos + 30 > floor - 10
  let playerFace =  50 + 48
  let objectIsAtPlayerFace = objectFace <= playerFace
  
  if (playerIsAtCactusHightRange && objectIsAtPlayerFace) {
     return true
  }
  return false
}

loop()