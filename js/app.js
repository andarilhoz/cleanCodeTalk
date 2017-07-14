class GameManager {
  constructor () {
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

var Manager = new GameManager()

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') { onSpace() }
})

function onSpace () {
  if (Manager.player.canJump && !Manager.gameOver) {
    Manager.player.jump()
  } else if (Manager.gameOver) {
    updateHighScore()
    resetGameVariables()
    startGame()
  }
}

function startGame(){
  initializeGameActors()
  loop()
}

function updateHighScore () {
  if (localStorage.getItem('HighScore') < Manager.timeInSecondsSinceStart) {
    localStorage.setItem('HighScore', Manager.timeInSecondsSinceStart)
  }
  Manager.highScore = localStorage.getItem('HighScore')
}

function resetGameVariables () {
  Manager.player.resetVariables()
  Manager.gameOver = false
  Manager.initialGameTime = new Date()
}

async function loop () {
  if(!Manager.gameOver) {
    updateManagerScreenVariables()
    setGameTime()
    draw(Manager.canvasContext)
    updateActors()
    window.requestAnimationFrame(loop)
  }
}

function initializeGameActors () {
  Manager.firstCactus = new Cactus()
  Manager.secondCactus = new Cactus()
  Manager.player = new Player()
}

function updateManagerScreenVariables () {
  Manager.floor = Manager.canvas.height / 2
  Manager.horizontalSplitScreen = Manager.canvas.width / 2
  Manager.canvas.width = window.innerWidth
  Manager.canvas.height = window.innerHeight
}

function setGameTime () {
  let currentGameTime = new Date()
  Manager.timeInSecondsSinceStart = Math.floor((currentGameTime - Manager.initialGameTime) / 1000)
}

function updateActors () {
  Manager.player.update()
  Manager.firstCactus.update()
  Manager.secondCactus.update()
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function draw () {
  drawFloor()
  drawBackGround()
  drawGUI()
  drawCactus(Manager.firstCactus.pos)
  drawCactus(Manager.secondCactus.pos)
  drawPlayer(Manager.player.personagemAltitude)
}

function drawFloor () {
  Manager.canvasContext.lineWidth = 5
  Manager.canvasContext.strokeStyle = 'yellow'
  Manager.canvasContext.moveTo(30, Manager.floor + 70)
  Manager.canvasContext.lineTo(Manager.canvas.width - 30, Manager.floor + 70)
  Manager.canvasContext.stroke()
}

function drawBackGround () {
  Manager.canvasContext.fillStyle = 'Grey'
  Manager.canvasContext.fillRect(10, 10, Manager.canvas.width - 20, Manager.canvas.height - 20)
  Manager.canvasContext.stroke()
}

function drawGUI () {
  Manager.canvasContext.lineWidth = 1
  Manager.canvasContext.fillStyle = 'black'
  Manager.canvasContext.font = '30px Arial'
  Manager.canvasContext.fillText('Time: ' + Manager.timeInSecondsSinceStart, Manager.horizontalSplitScreen - 200, 100)

  Manager.canvasContext.fillText('HighScore: ' + Manager.highScore, Manager.horizontalSplitScreen, 100)
}

function drawCactus (pos) {
  Manager.canvasContext.strokeStyle = 'green'
  Manager.canvasContext.lineWidth = 3
  Manager.canvasContext.strokeRect(pos, Manager.floor, 30, 70)
}

function drawPlayer (verticalPos) {
  Manager.canvasContext.strokeStyle = 'red'
  Manager.canvasContext.lineWidth = 5
  Manager.canvasContext.strokeRect(50, verticalPos, 50, 50)
}

class Player {
  constructor () {
    this.jumping = false
    this.playerSpeed = 5
    this.maxJumpHeight = 250
    this.canJump = true
    this.personagemAltitude = Manager.floor
    this.jumpSpeed = 50
    this.relativePos = (Manager.floor - this.personagemAltitude)
    this.playerFloor
  }

  update () {
    this.updatePlayerPos()
    this.ableJumpWhenHitFloor()
    this.startFallingWhenHitMaxHeight()
    this.resetJumpSpeed()
  }

  updatePlayerPos () {
    this.personagemAltitude = this.personagemAltitude || Manager.floor

    let jumpSpeedFixed = this.jumpSpeed > 0 ? this.jumpSpeed -= 35 : 1
    let playerFloorCorrection = Manager.floor + 15

    let playerIsGoingUp = this.jumping && this.relativePos <= this.maxJumpHeight
    let playerIsFalling = playerFloorCorrection > this.personagemAltitude && !this.jumping
    let playerIsIdle = !this.jumping

    if (playerIsGoingUp) {
      this.personagemAltitude -= jumpSpeedFixed
    } else if (playerIsFalling) {
      this.personagemAltitude += jumpSpeedFixed
    } else if (playerIsIdle) {
      this.personagemAltitude = playerFloorCorrection
    }

    this.relativePos = (playerFloorCorrection - this.personagemAltitude)
  }

  ableJumpWhenHitFloor () {
    if (!this.jumping && this.relativePos === 0) { this.canJump = true }
  }

  startFallingWhenHitMaxHeight () {
    if (this.relativePos >= this.maxJumpHeight) { this.jumping = false }
  }

  resetJumpSpeed () {
    this.jumpSpeed = 50
  }

  jump () {
    Manager.player.jumping = true
    Manager.player.canJump = false
  }

  resetVariables () {
    this.jumping = false
    this.personagemAltitude = 0
  }
}

class Cactus {
  constructor () {
    this.pos = 0
  }

  update () {
    this.updatePos()
    this.checkCollisionWithPlayer()
  }

  updatePos () {
    if (this.pos <= 0) { this.pos = this.getRandomSpawn() }

    this.pos = this.pos || this.getRandomSpawn(new Date())
    this.pos -= Manager.player.playerSpeed
  }

  checkCollisionWithPlayer () {
    if (checkForCollision(this.pos, Manager.player.personagemAltitude, Manager.floor)) {
      Manager.gameOver = true
    }
  }

  getRandomSpawn (seed) {
    let minimumDistanceFromPlayer = 200
    let lastCactusPos = getLastCactusPos()
    let maxDistanceFromPlayer = Manager.canvas.width || minimumDistanceFromPlayer
    let minimumDistance = minimumDistanceFromPlayer + lastCactusPos 
    let maxDistance = lastCactusPos + maxDistanceFromPlayer
    return Math.floor(Math.random() * (maxDistance - minimumDistance) + minimumDistance)
  }
}
function getLastCactusPos(){
  if(Manager.firstCactus.pos > Manager.secondCactus.pos)
    return Manager.firstCactus.pos
  return Manager.secondCactus.pos
}

function checkForCollision (objectFace, pos, floor) {
  let playerIsAtCactusHightRange = pos + 40 > floor 
  let playerFace = 98
  let objectIsAtPlayerFace = objectFace <= playerFace

  let playerBack = 48
  let objectDidNotPassByPlayer = playerBack < objectFace + 30

  if (playerIsAtCactusHightRange &&(objectIsAtPlayerFace && objectDidNotPassByPlayer) ) {
    return true
  }
  return false
}

startGame()