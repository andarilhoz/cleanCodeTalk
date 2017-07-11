/* important! for alignment, you should make things
 * relative to the canvas' current width/height.
 */
let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
let date = new Date()
let difference = 0
let fps = 20
let initialCactusPos = 800;
let cactusPos = 400
let jumping = false;
let maxJumpHeight = 250;
let actualPos = 0
let cactusSpeed = 5;
let podePula = true
let relativePos = 0
let gameOver = false
let HighScore = localStorage.getItem('HighScore')
let jumpSpeed = 50;
let firstCactus 
let secondCactus

document.addEventListener('keydown', function (e) {
  if(e.code == 'Space'){
    if(podePula && !gameOver) jumping = true;
    if(gameOver){
       jumping = false
       actualPos = 0
       gameOver = false;
       cactusPos = initialCactusPos
       if(localStorage.getItem('HighScore') < difference)
        localStorage.setItem('HighScore',difference)
      
       HighScore = localStorage.getItem('HighScore')
       date = new Date()
       loop()
    }
  
    podePula = false
  }
})

function draw () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  // ...drawing code...
  let floor = canvas.height / 2 +20
  let initialHeight = canvas.height / 2 +20

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

    let floor = canvas.height / 2 
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

function checkForCollision(objectPosW, pos, floor) {
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


function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loop () {
    firstCactus = new cactusGenerator()
    secondCactus = new cactusGenerator()
  while (!gameOver) {

    let current = new Date()
    difference = Math.floor((current - date ) / 1000)
    //console.log(difference)


    draw()

    await sleep(fps)

  }
}

loop()
