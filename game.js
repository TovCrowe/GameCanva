let canvas = document.getElementById("gameCanvas");
let context = canvas.getContext("2d");
let score = 0;
let aliens = [];
let bullet = null;
let aliensKilled = 0;
let shootingSpeed = 5;
let animateID = null;
let shootingSpeedMax = 16;
canvas.addEventListener("mousedown", shoot);
// normal alien
class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = Math.random() * 4 + 1;
    this.update = function () {
      // Actualizar la posición del alienígena
      this.x -= this.speed;
      // Dibujar el alienígena en el canvas
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}
// bala
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.speed = shootingSpeed;
    this.update = function () {
      // Actualizar la posición de la bala
      this.x += this.speed;
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}
class SmallAlien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = Math.random() * 6 + 2;
    this.update = function () {
      // Actualizar la posición del alienígena
      this.x -= this.speed;
      context.fillStyle = "orange";
      context.fillRect(this.x, this.y, this.width, this.height);
    };
  }
}
// bucle
function gameLoop() {
  // limpiar del canva
  context.clearRect(0, 0, canvas.width, canvas.height);
  // general aliens randoms
  if (Math.random() < 0.01) {
    var alien = new Alien(canvas.width, Math.random() * (canvas.height - 50));
    aliens.push(alien);
  }
  if (Math.random() < 0.01) {
    var alien = new SmallAlien(
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
      aliensKilled++;
      if (shootingSpeed < shootingSpeedMax) {
        shootingSpeed++;
      }
    }

    // si el alien llega donde sale la bala se borre
    if (alien.x < 0) {
      aliens.splice(aliens.indexOf(alien), 1);
    }
  });
  //general bala
  if (aliensKilled >= 10) {
    console.log(score);
    animateID = cancelAnimationFrame(animateID);
    setTimeout(() => {
      animateID = requestAnimationFrame(gameLoop);
    }, 3000);
    aliens = [];
    aliensKilled = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (bullet) {
    bullet.update();
    //norrar la bala si no choca con nada
    if (bullet.x > canvas.width) {
      bullet = null;
    }
  }
  // display score
  context.fillStyle = "white";
  context.font = "24px Arial";
  context.fillText("Puntuación: " + score, 10, 30);
  // loop
  if (animateID) {
    requestAnimationFrame(gameLoop);
  }
}
console.log(score);
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
  if (!bullet) {
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
