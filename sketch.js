var genius;
var ground;
var background_img;
var scene, obstacleGroup;
var obstacle1_img;
var gameState = "wait";
var textBox;
var playButton, endButton, againButton, invitation_img, invitation, genius_img, ground_img
var question,correctAns,submitButton,questionElement,ans,gameOver_sound,happy_sound;
var score=0;
var lifetime=0;
var onceMore;
var collide_sound;
var coin,coin_image ;
var count=0;
var coinsGroup
var indication;
var jump_sound;
var coin_sound;

function preload() {
  background_img = loadImage("background2.jpg");
  obstacle1_img = loadImage("bullet-removebg-preview.png");
  obstacle2_img = loadImage("police.png");
  invitation_img = loadImage("invitation.png");
  genius_img = loadImage("genius-removebg-preview.png");
  ground_img = loadImage("ground.png");
  gameOver_sound=loadSound("gameOver.wav")
  happy_sound=loadSound("haha.wav")
  collide_sound=loadSound("Collide.mp3")
  coin_image=loadImage("coins-removebg-preview.png")
  jump_sound=loadSound("smrpg_jump.wav")
  coin_sound=loadSound("coin_appear.wav")
}

function setup() {
  createCanvas(displayWidth, displayHeight - 150);
  
  playButton = createButton("LET'S PLAY");
  playButton.position(width / 2, height / 2 - 200);

  endButton = createButton("END GAME");
  endButton.position(-30, -30);

  againButton = createButton("PLAY AGAIN!!");
  againButton.position(-30, -30);



  scene = createSprite(width / 2, height / 2, width, height);
  scene.addImage("background", background_img);
  scene.scale = 1;

  indication=createSprite(width/2-473,height/2-187,20,20)
  indication.addImage("hello",coin_image)
  indication.scale=0.2

  genius = createSprite(width / 10, height / 2, 50, 50);
  genius.addImage("hello", genius_img);
  genius.scale = 0.5;
  genius.setCollider("rectangle", 15, 10, 270,450);

  ground = createSprite(width / 2, height + 730, width, 20);
  ground.addImage("hello", ground_img);
  ground.scale = 12;
  
  obstacleGroup = new Group();
  coinsGroup = new Group()

  invitation = createSprite(width / 2.1 + 70, height / 3, 50, 50);
  invitation.addImage("invitation", invitation_img);
  invitation.scale = 0.5;


}

function draw() {
  background("lightblue");
  drawSprites();
  textSize(20)
  textStyle(BOLD)
  fill("darkBlue")
  text("Score="+ score,width/2-450,height/2-150)
  text("Collected="+ count,width/2-450,height/2-180)
 

  if (gameState == "wait") {
    textSize(17);
    textStyle(BOLD)
    fill("black");
    text("1. Press (end game) button to end.", width / 2 - 150, height / 2 -20);
     text("2.There are 2 obstacle in the game. ", width / 2 - 150, height / 2 + 10);
     text("3. Whenever you touch the obstacle you will face a Maths Question.", width / 2 - 150, height / 2 + 40);
     text("4.If you answer is wrong game automatically ends!.", width / 2 - 150, height / 2 + 70);
    text("5.If the answer is correct game resume automatically.", width / 2 - 150, height / 2 + 100);
    text("6.Every write question give you 50 points.", width / 2 - 150, height / 2 + 130);
    text("7.You  have to  score 1000 points to win.", width / 2 - 150, height / 2 + 160);
    


  }

  playButton.mousePressed(function () {
    gameState = "play";
    endButton.position(width / 2 + 500, 50);
    invitation.visible = false;
  });

  

  if(score==1000){
    gameState="win"
  }

  if(gameState=="win"){
    againButton.position(width / 2 - 15, height / 2 - 200 + 10)
    textSize(30)
    textStyle(BOLD)
    text("WINNER #1",width/2-30,height/2)
    textSize(17)
    text("Refresh the screen to play again ",width/2-70,height/2+50)


    scene.velocityY = 0;
    genius.velocityY=0;

    obstacleGroup.destroyEach();
    obstacleGroup.setlifetimeEach = null;
    endButton.position(-30,-30)
  }
  


  if (gameState == "play") {
    if (keyDown("space") && genius.collide(ground)) {
      genius.velocityY = -15;
      jump_sound.play();

    }

    spawnCoins()


    genius.velocityY = genius.velocityY + 0.5;

    scene.velocityX = -(4.5+score/100);
    if (scene.x < 500) {
      scene.x = width / 2;
    }

    spawnObstacles();
    
    if (obstacleGroup.isTouching(genius)) {
        scene.velocityX = 0;
        obstacleGroup.setVelocityXEach(0);
        spawnQuestion()
         questionElement = createElement("h2",question)
         collide_sound.play()
    
        textBox = createInput("Answer")
         submitButton = createButton("Submit")
         submitButton.position(width/2+207,height/2+30)
        textBox.position(width/2+40, height/2+30);
         questionElement.position(width/2-56, height/2+8)
     

        gameState="pause";

    }

    if (coinsGroup.isTouching(genius)){
      coinsGroup.destroyEach()
      count=count+1
      coin_sound.play()
    }
    
    playButton.position(-30, -30);
    againButton.position(-30, -30);
  }


  if(gameState=="pause"){
    textSize(20);
    textStyle(BOLD)
    fill("black");
    text("Answer the given question!!.",width/2-100,height/2);
    genius.velocityY = genius.velocityY + 0.5
    obstacleGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    coinsGroup.destroyEach()
    console.log(correctAns)

    submitButton.mousePressed(function(){

      ans = textBox.value()
      console.log(ans)

      textSize(20);
      fill("white");
      if(correctAns == ans){
        happy_sound.play();
        obstacleGroup.destroyEach();
        questionElement.hide();
        submitButton.hide();
        textBox.hide();
        correctAns=null;
        ans=null;
        gameState = "play";
        score=score+50

      }

      else{
          console.log("incorrect")
          gameState = "end";
          gameOver_sound.play();
          questionElement.hide();
          submitButton.hide();
          textBox.hide();
          correctAns=null;
          ans=null;
      }

     

    

  })

  
  }

  else if (gameState == "end") {

    fill("darkBlue");
    textSize(30);
    text("HEY CHAMP TRY AGAIN !!", width / 2 - 150, height / 2 - 10);
    genius.velocityY = genius.velocityY + 0.5
    scene.velocityX = 0;
    genius.velocityY = 0;

    obstacleGroup.destroyEach();
    obstacleGroup.setlifetimeEach = null;
    coinsGroup.destroyEach()

    endButton.position(-30, -30);
    againButton.position(width / 2 - 15, height / 2 - 200 + 10);
  }
  
  endButton.mousePressed(function () {
    gameState = "end";
    lifetime=0;
    invitation.visible = true;
    coinsGroup.destroyEach()
    questionElement.hide();
    submitButton.hide();
    textBox.hide();
    correctAns=null;
    ans=null;
  });

  againButton.mousePressed(function () {
    count=0;
    gameState = "play";
    endButton.position(width / 2 + 500, 50);
    invitation.visible = false;
    questionElement.hide();
    coinsGroup.destroyEach()
    submitButton.hide();
    textBox.hide();
    score=0;
  
    correctAns=null;
    ans=null;
  });
  
  genius.collide(ground);

}

function spawnObstacles() {
  if (frameCount % 250 == 0) {

    var run = Math.round(random(1, 2));

    if (run == 1) {
      var obstacle1 = createSprite(width, height - 120, 50, 50);
      obstacle1.setCollider("circle", 15, 10, 20);
      obstacle1.velocityX = -(8+score/100);
      obstacle1.lifetime = - Math.round(width / obstacle1.velocityX);
      obstacle1.addImage("obstacle", obstacle1_img);
      obstacle1.scale = 0.6;
      obstacleGroup.add(obstacle1);
    }

    if (run == 2) {
      var obstacle2 = createSprite(width, height - 80, 50, 50);
      obstacle2.velocityX = -(8+score/100);
      obstacle2.setCollider("rectangle", 15, 10, 270,270)
      obstacle2.lifetime = - Math.round(width / obstacle2.velocityX);
      obstacle2.addImage("obstacle", obstacle2_img);
      obstacle2.scale = 0.5;
      obstacleGroup.add(obstacle2);
    }
  }
}


function spawnQuestion() {
  var number1 = Math.round(random(20, 200));
  var operator;
  var rand = Math.round(random(1, 3));
  
  switch (rand) {
    case 1:
      operator = "+";
      break;

    case 2:
      operator = "-";
      break;

    case 3:
      operator = "*";
      break;

    default:
      break;
  }

  var number2 = Math.round(random(20, 200));

  fill("white");
  textSize(23)
  question = number1 + "+" + number2 +  "="
  correctAns = number1 + number2 
}


function spawnCoins(){
  if(frameCount%350==0){
    var coins=createSprite(width,random(height-200,height-300),20,20)
    coins.velocityX= -(8+score/100)
    coins.addImage("hello",coin_image)
    coins.scale=0.2;
    coins.lifetime=- Math.round(width /coins.velocityX);
    coinsGroup.add(coins)


  }

}