let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");
let score = 0;
let aliens = [];
let bullet = null;
let aliensWave1 = 0;
let aliensWave2 = 0;
let aliensWave3 = 0;
let aliensWave4 = 0;
let aliensWave5 = 0;
let alienSpeedNormal = 1
let alienSmallSpeed = 2
let playerHP = 10
let waveStarted = false;
let gameOver = false;
let shootingSpeed = 5;
let animateID = null;
let shootingSpeedMax = 16;

let alienImage = new Image();
alienImage.src = "./Imagenes/enemigoNormal.png";

let smallAlienImage = new Image();
smallAlienImage.src = "./Imagenes/SmallEnemy.png";

let backgroundImage = new Image();
backgroundImage.src = "./Imagenes/Eath.png";

let mainSpcImage = new Image();
mainSpcImage.src = "./Imagenes/Main.png";

canvas.addEventListener("mousedown", shoot);
// normal alien
class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 90;
    this.height = 90;
    this.speed = alienSpeedNormal;
    this.update = function () {
      // Actualizar la posición del alienígena
      this.x -= this.speed;
      
      // Dibujar el alienígena en el canvas
      context.drawImage(alienImage ,this.x, this.y, this.width, this.height);
    };
  }
}
class SmallAlien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.speed =  alienSmallSpeed;
    this.update = function () {
      // Actualizar la posición del alienígena
      this.x -= this.speed;
      context.drawImage(smallAlienImage ,this.x, this.y, this.width, this.height);
    };
  }
}
// bala

// Bullet
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.speed = shootingSpeed;
    this.update = function() {
      // Move the bullet
      this.x += this.speed;
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}
class Spaceship {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.width = 100;
    this.height = 50;

    // Add event listener for mousemove event
    canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  update() {
    context.drawImage(mainSpcImage, this.x, this.y, this.width, this.height);
  }


  handleMouseMove(event) {
    // Calculate the mouse position relative to the canvas
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;

    // Update the y position of the spaceship based on the mouse position
    this.y = mouseY - this.height / 2;

    // Keep the spaceship within the bounds of the canvas
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
    }
  }

  shootBullet() {
    if (!bullet && !gameOver) {
      bullet = new Bullet(this.x + this.width, this.y + this.height / 2);
    }
  }
}

backgroundImage.onload = function() {
  context.drawImage(backgroundImage, 0, 0); 
  animateID = requestAnimationFrame(gameLoop); 
};


let spaceship = new Spaceship();

// bucle
function gameLoop() {
  if (gameOver) {
    return; 
  }
  

  // limpiar del canva
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);  // general aliens randoms
  spaceship.update();

  if (Math.random() < 0.014) {
    let alien = new Alien(canvas.width, Math.random() * (canvas.height - 50));
    aliens.push(alien);
  }
  
  if (Math.random() < 0.014) {
    let alien = new SmallAlien(
      canvas.width,
      Math.random() * (canvas.height - 50)
    );
    aliens.push(alien);
  }

  // actualizar y general aliens
  aliens.forEach(function (alien) {
    alien.update();
    // colision bala/alien
    if (
      bullet &&
      bullet.x < alien.x + alien.width &&
      bullet.x + bullet.width > alien.x &&
      bullet.y < alien.y + alien.height &&
      bullet.y + bullet.height > alien.y
    ) {
      // matar al alien
      aliens.splice(aliens.indexOf(alien), 1);
      bullet = null;
      // score
      score++;
      aliensWave1++;
      aliensWave2++;
      aliensWave3++;
      aliensWave4++;
      aliensWave5++;
      if (shootingSpeed < shootingSpeedMax) {
        shootingSpeed++;
      }
    }
    // si el alien llega donde sale la bala se borre
    if (alien.x < 0) {
      aliens.splice(aliens.indexOf(alien), 1);
      playerHP -= 1
    }
  });
  context.fillStyle = "green";
  context.font = "24px Arial";
  context.fillText("HP: " + playerHP, canvas.width - 100, 30);

  if (aliensWave1 >= 10 && score >= 10 && score <= 20) {
    waveStarted = true;
    animateID = cancelAnimationFrame(animateID);
    setTimeout(() => {
      animateID = requestAnimationFrame(gameLoop);
      aliens = [];
      aliensWave1 = 0;
    }, 3000);
    context.clearRect(0, 0, canvas.width, canvas.height);
    alienSmallSpeed = 12;
    if (waveStarted && score >= 10 && score < 20) {
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.fillText("OLEADA 1", canvas.width / 2 - 100, canvas.height / 2);
    }
  }
  
  if (aliensWave2 >= 20 && score >= 20 && score <= 30) {
    console.log(score);
    waveStarted = true;
    animateID = cancelAnimationFrame(animateID);
    setTimeout(() => {
      animateID = requestAnimationFrame(gameLoop);
      aliens = [];
      aliensWave1 = 0;
      aliensWave2 = 0;
    }, 3000);
    context.clearRect(0, 0, canvas.width, canvas.height);
    alienSmallSpeed = 16;
    if (waveStarted && score >= 20 && score < 30) {
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.fillText("OLEADA 2", canvas.width / 2 - 100, canvas.height / 2);
    }
  }
  
  if (aliensWave3 >= 30 && score >= 30 && score <= 40) {
    console.log(score);
    waveStarted = true;
    animateID = cancelAnimationFrame(animateID);
    setTimeout(() => {
      animateID = requestAnimationFrame(gameLoop);
      aliens = [];
      aliensWave1 = 0;
      aliensWave2 = 0;
      aliensWave3 = 0;
    }, 3000);
    context.clearRect(0, 0, canvas.width, canvas.height);
    alienSmallSpeed = 52;
    if (waveStarted && score >= 30 && score < 40) {
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.fillText("OLEADA 3", canvas.width / 2 - 100, canvas.height / 2);
    }
  }
  
  if (aliensWave4 >= 40 && score >= 40 && score <= 50) {
    console.log(score);
    waveStarted = true;
    animateID = cancelAnimationFrame(animateID);
    setTimeout(() => {
      animateID = requestAnimationFrame(gameLoop);
      aliens = [];
      aliensWave1 = 0;
      aliensWave2 = 0;
      aliensWave3 = 0;
      aliensWave4 = 0;
    }, 3000);
    context.clearRect(0, 0, canvas.width, canvas.height);
    alienSmallSpeed = 23;
    if (waveStarted && score >= 40 && score < 50) {
      context.fillStyle = "white";
      context.font = "48px Arial";
      context.fillText("OLEADA 4", canvas.width / 2 - 100, canvas.height / 2);
    }
  }
  if(playerHP <= 0) {
    gameLocked = true
    cancelAnimationFrame(animateID); 
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    context.fillStyle = "red";
    context.font = "70px Arial";
    context.fillText("Game Over", canvas.width / 2 - 200 , canvas.height / 2);
  }


  if (bullet) {
    bullet.update();
    //norrar la bala si no choca con nada
    if (bullet.x > canvas.width) {
      bullet = null;
    }
  }
  // display score
  context.fillStyle = "WHITE";
  context.font = "30px Arial";
  context.fillText("Puntuación: " + score, 10, 30);
  // loop
  if (animateID) {
    requestAnimationFrame(gameLoop);
  }
  
}
if (score >= 10) {
  console.log(score);
  animateID = cancelAnimationFrame(animateID);
  setTimeout(() => {
    animateID = requestAnimationFrame(gameLoop);
  }, 3000);
  aliens = [];
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// disparo
function shoot(event) {
  // SOLO puede existir una bala
  if (!bullet && !gameOver) {
    // ubicar donde esta el mouse
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;
    // crear la bala de 0 hacia donde esta el mouse
    bullet = new Bullet(0, mouseY);
  }
}


window.onload = () => {
  animateID = requestAnimationFrame(gameLoop);
  
};