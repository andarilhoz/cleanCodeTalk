class GameManager {
  constructor() {
    this.canvas = document.querySelector('#canvas') || { getContext: function () { return null } }
    this.canvasContext = this.canvas.getContext('2d')
    this.initialGameTime = new Date()
    this.timeInSecondsSinceStart = 0
    this.sleepTime = 20
    this.gameOver = false
    this.highScore = localStorage.getItem('HighScore')
    this.floor = this.canvas.height / 2
    this.horizontalSplitScreen = this.canvas.width / 2
    this.firstCactus
    this.secondCactus
    this.player
  }
}

var Manager = new GameManager();

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { onSpace(loop) }
})

function onSpace(loop) {
  if (Manager.player.canJump && !Manager.gameOver){
    Manager.player.jumping = true
    Manager.player.canJump = false
  }
  else if (Manager.gameOver) {
    updateHighScore()
    resetGameVariables()
    loop()
  }
}

function updateHighScore(){
  if (localStorage.getItem('HighScore') < Manager.timeInSecondsSinceStart) { 
    localStorage.setItem('HighScore', Manager.timeInSecondsSinceStart) 
  }
}

function resetGameVariables(){
    Manager.player.jumping = false
    Manager.player.personagemAltitude = 0
    Manager.gameOver = false
    Manager.highScore = localStorage.getItem('HighScore')
    Manager.initialGameTime = new Date()
}

async function loop() {
  initializeGameActors()
  while (!Manager.gameOver) {
    updateManagerScreenVariables()
    draw(Manager.canvasContext)
    updateActors()
    await sleep(Manager.sleepTime)
  }
}

function initializeGameActors(){
  Manager.firstCactus = new Cactus()
  Manager.secondCactus = new Cactus()
  Manager.player = new Player()
}

function updateManagerScreenVariables(){
  let currentGameTime = new Date()
  Manager.floor = Manager.canvas.height / 2
  Manager.horizontalSplitScreen = Manager.canvas.width / 2
  Manager.timeInSecondsSinceStart = Math.floor((currentGameTime - Manager.initialGameTime) / 1000)
  Manager.canvas.width = window.innerWidth
  Manager.canvas.height = window.innerHeight
}

function updateActors() {
    Manager.player.update()
    Manager.firstCactus.update()
    Manager.secondCactus.update()     
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function draw() {
  drawFloor()
  drawBackGround()
  drawGUI()  
  drawCactus(Manager.firstCactus.pos)
  drawCactus(Manager.secondCactus.pos)
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


class Player {
  constructor() {
    this.jumping = false
    this.playerSpeed = 5
    this.maxJumpHeight = 250
    this.canJump = true
    this.personagemAltitude = Manager.floor
    this.jumpSpeed = 50
    this.relativePos = (Manager.floor - this.personagemAltitude)
    this.playerFloor
  }

  update() {
    this.updatePlayerPos()
    this.ableJumpWhenHitFloor()
    this.startFallingWhenHitMaxHeight()
    this.resetJumpSpeed()
  }

  updatePlayerPos(){
    this.personagemAltitude = this.personagemAltitude || Manager.floor
    
    let jumpSpeedFixed = this.jumpSpeed > 0 ? this.jumpSpeed -= 35 : 1
    let playerFloorCorrection = Manager.floor + 15
    
    let playerIsJumping = this.jumping && this.relativePos <= this.maxJumpHeight
    let playerIsFalling = playerFloorCorrection > this.personagemAltitude && !this.jumping
    let playerIsIdle = !this.jumping

    if (playerIsJumping) {
      this.personagemAltitude -= jumpSpeedFixed
    } else if (playerIsFalling) {
      this.personagemAltitude += jumpSpeedFixed
    } else if (playerIsIdle) {
      this.personagemAltitude = playerFloorCorrection 
    }

    this.relativePos = (playerFloorCorrection - this.personagemAltitude)
  }

  ableJumpWhenHitFloor(){
    if(!this.jumping && this.relativePos == 0)
      this.canJump = true
  }

  startFallingWhenHitMaxHeight(){
    if (this.relativePos >= this.maxJumpHeight)  
      this.jumping = false 
  }

  resetJumpSpeed(){
    this.jumpSpeed = 50
  }

}

class Cactus {
  constructor(){
    this.pos = 0
  }
  
  update() {
    this.updatePos()
    this.checkCollisionWithPlayer()
  }

  updatePos(){
    if (this.pos <= 0) 
      this.pos = this.getRandomSpawn()

    this.pos = this.pos || getRandomSpawn(new Date())
    this.pos -= Manager.player.playerSpeed 
  }
  
  checkCollisionWithPlayer(){
    if (checkForCollision(this.pos, Manager.player.personagemAltitude, Manager.floor)) {
      Manager.gameOver = true
    }
  }

  getRandomSpawn(seed) {
    let minimumDistanceFromPlayer = 400
    let width = Manager.canvas.width || minimumDistanceFromPlayer
    return Math.floor(Math.random() * (width - minimumDistanceFromPlayer) + minimumDistanceFromPlayer)
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