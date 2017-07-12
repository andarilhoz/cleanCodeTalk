

var canvas = document.querySelector('#canvas') || {getContext:function(){return null}}
var ctx = canvas.getContext('2d') 
var date = new Date()
var difference = 0
var fps = 20
var initialCactusPos = 800;
var cactusPos = 400
var jumping = false;
var maxJumpHeight = 250;
var actualPos = 0
var cactusSpeed = 5;
var podePula = true
var relativePos = 0
var gameOver = false
var HighScore = localStorage.getItem('HighScore')
var jumpSpeed = 50;
var firstCactus 
var secondCactus

document.addEventListener('keydown', function (e) {
    if(e.code == 'Space')
        onSpace(loop)
})

function onSpace(fn) {
    if(podePula && !gameOver) jumping = true;
    if(gameOver){
        jumping = false
        actualPos = 0
        gameOver = false;
        // cactusPos = initialCactusPos
        
        if(localStorage.getItem('HighScore') < difference)
        localStorage.setItem('HighScore',difference)
        
        HighScore = localStorage.getItem('HighScore')
        date = new Date()
        fn()
    }

    podePula = false
}

function draw () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  floor = canvas.height / 2 +20
  initialHeight = canvas.height / 2 +20

  ctx.fillStyle = 'Grey'
  ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)
  ctx.stroke()

  ctx.lineWidth = 5
  ctx.strokeStyle = 'yellow'
  ctx.moveTo(30, canvas.height / 2 + 70)
  ctx.lineTo(canvas.width - 30, canvas.height / 2 + 70)
  ctx.stroke()
  
  if(firstCactus.getPos() <= 0)
    firstCactus.updatePos(Math.floor(Math.random() * (canvas.width - secondCactus.getPos() + 200) +  secondCactus.getPos() + 200))
  firstCactus.update()
  if(secondCactus.getPos() <= 0)
    secondCactus.updatePos(Math.floor(Math.random() * (canvas.width - firstCactus.getPos() + 200) +  firstCactus.getPos() + 200))
  secondCactus.update()

  ctx.lineWidth = 1
  ctx.fillStyle = 'black'
  ctx.font = '30px Arial'
  ctx.fillText('Time: ' + difference, canvas.width / 2  - 200, 100)

  ctx.fillText('HighScore: ' + HighScore, canvas.width / 2, 100)

  drawPersonagem(floor, jumpSpeed);

}

function cactusGenerator () {
  this.pos = 0;
  this.updatePos = function(val){
    this.pos = val;
  }
  this.getPos = function(){
    return this.pos
  }
  this.update = function(){

    var floor = canvas.height / 2 
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3
    
    //console.log(this.pos, this.initialPos == 400 ? 'primeiro' : 'segundo')
    
    if(this.pos <= 0)
         this.pos =  Math.floor(Math.random() * (800-400 +1) +400)

      ctx.strokeRect(this.pos-=cactusSpeed, floor, 30, 70)

      if(checkForCollision(this.pos, actualPos,floor)){
        gameOver = true
      }
  }

}

function checkForCollision(objectPosW, pos, floor) { // tested
  // ctx.fillStyle = 'purple'
  // ctx.fillRect(objectPosW +2,floor,5,5);
  // ctx.fillRect(objectPosW +32,floor,5,5);

  // ctx.fillStyle = 'black'
  // ctx.fillRect(playerPos -2,pos,5,5);
  // ctx.fillRect(playerPos +48,pos,5,5);

  // ctx.fillStyle = 'pink'
  // ctx.fillRect(objectPosW,floor - 20,5,5)
  
  // ctx.fillStyle = 'green'
  // ctx.fillRect(50,pos + 50,5,5)

  if( pos + 50 > floor - 20 ) 
  if((objectPosW +32 >= 50 -2 &&  objectPosW+2 <= 50 + 48) ||
    objectPosW +2 >= 50+48 && objectPosW+32 <= 50 -2)
    return true

  return false
}

function drawPersonagem(floor, jumpSpeed){
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 5
  if(actualPos == 0)
    actualPos = floor
  relativePos = (floor - actualPos );
  // console.log(actualPos, relativePos)
  // console.log(maxJumpHeight)
  if(jumping && relativePos < maxJumpHeight)
    ctx.strokeRect(50, actualPos-= jumpSpeed > 0? jumpSpeed-= 35: 1, 50, 50)
  else if( relativePos >= maxJumpHeight)
    jumping = false

  if( floor > actualPos && !jumping){
    ctx.strokeRect(50, actualPos+= jumpSpeed > 0  ? jumpSpeed-= 35: 1, 50, 50)
  }else if(!jumping){
    ctx.strokeRect(50, floor, 50, 50)
    actualPos = floor
    jumpSpeed = 10
    podePula = true
  }
}


function sleep (ms) { // tested
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop () {
    firstCactus = new cactusGenerator()
    secondCactus = new cactusGenerator()
  while (!gameOver) {

    var current = new Date()
    difference = Math.floor((current - date ) / 1000)
    //console.log(difference)


    draw()

    await sleep(fps)

  }
}

loop()
