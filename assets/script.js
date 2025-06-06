// ========== LOGIN TO DESKTOP ==========

document.querySelector('.login-arrow').addEventListener('click', () => {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('desktopContainer').style.display = 'block';
});

// ========== DATE & TIME ==========

function updateDateTime() {
  const now = new Date();
  const datetime = document.getElementById("datetime");

  const date = now.toLocaleDateString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  });
  const time = now.toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit'
  });

  datetime.textContent = `${date} | ${time}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ========== OPEN / CLOSE WINDOWS ==========

function openWindow(id) {
  document.getElementById(id).style.display = 'block';
}

function closeWindow(id) {
  document.getElementById(id).style.display = 'none';
}

// ========== START MENU TOGGLE ==========

function toggleStartMenu() {
  const menu = document.getElementById('startMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ========== SHUTDOWN ==========

let shutdownBunnyInterval;

function shutdown() {
  const screen = document.getElementById('shutdownScreen');
  const bunny = document.getElementById('shutdownBunny');
  const text = document.getElementById('shutdownText');
  const taskbar = document.getElementById('taskbar');
  const startMenu = document.getElementById('startMenu');

  taskbar.style.display = 'none';
  if (startMenu) startMenu.style.display = 'none';

  screen.style.display = 'flex';
  screen.classList.remove('hidden');
  text.textContent = 'powering down...';

  let frame = 3;
  shutdownBunnyInterval = setInterval(() => {
    frame = frame === 3 ? 4 : 3;
    bunny.src = `assets/images/bunny${frame}.png`;
  }, 500);

  screen.addEventListener('click', restoreFromShutdown, { once: true });
}

function restoreFromShutdown() {
  const screen = document.getElementById('shutdownScreen');
  clearInterval(shutdownBunnyInterval);

  screen.classList.add('hidden');
  setTimeout(() => {
    screen.style.display = 'none';
    screen.classList.remove('hidden');
    document.getElementById('taskbar').style.display = 'flex';
  }, 400);
}

// ========== SLEEP ==========

let sleepBunnyInterval;
let lastMoveX = null;
let lastDirection = null;
let directionChanges = 0;
let shakeTimeout;

function sleep() {
  const screen = document.getElementById('sleepScreen');
  const bunny = document.getElementById('sleepBunny');
  const text = document.getElementById('sleepText');
  const taskbar = document.getElementById('taskbar');
  const startMenu = document.getElementById('startMenu');

  taskbar.style.display = 'none';
  if (startMenu) startMenu.style.display = 'none';

  screen.style.display = 'flex';
  screen.classList.remove('hidden');
  text.textContent = 'sleeping...';

  let frame = 1;
  sleepBunnyInterval = setInterval(() => {
    frame = frame === 1 ? 2 : 1;
    bunny.src = `assets/images/bunny${frame}.png`;
  }, 500);

  // shake detection

  lastMoveX = null;
  directionChanges = 0;
  lastDirection = null;
  document.addEventListener('mousemove', detectShake);
}

function detectShake(e) {
  if (lastMoveX === null) {
    lastMoveX = e.clientX;
    return;
  }

  const dx = e.clientX - lastMoveX;
  const currentDirection = dx > 0 ? 'right' : dx < 0 ? 'left' : null;

  if (currentDirection && currentDirection !== lastDirection) {
    directionChanges++;
    lastDirection = currentDirection;

    if (directionChanges >= 4) {
      document.removeEventListener('mousemove', detectShake);
      restoreFromSleep();
    }

    clearTimeout(shakeTimeout);
    shakeTimeout = setTimeout(() => {
      directionChanges = 0;
      lastDirection = null;
    }, 800);
  }

  lastMoveX = e.clientX;
}

function restoreFromSleep() {
  const screen = document.getElementById('sleepScreen');
  clearInterval(sleepBunnyInterval);
  screen.classList.add('hidden');

  setTimeout(() => {
    screen.style.display = 'none';
    screen.classList.remove('hidden');
    document.getElementById('taskbar').style.display = 'flex';
  }, 400);
}

// ========== MUSIC ==========

const music = new Audio("assets/song/ditto.mp3");
music.loop = true;

const musicBtn = document.getElementById('taskbar-music-btn');
const musicIcon = document.getElementById('music-icon');

function toggleMusic() {

  if (music.paused) {
    music.play();
    musicIcon.src = 'assets/images/pause.png';
    musicIcon.alt = 'Pause Music';
  } else {
    music.pause();
    musicIcon.src = 'assets/images/start.png';
     musicIcon.alt = 'Play Music';
  }
}

window.addEventListener('click', function initMusic() {
  music.play()
    .then(() => {
      musicBtn.style.display = 'inline-block';
      musicIcon.src = 'assets/images/pause.png';
      musicIcon.alt = 'Pause Music';
    })
    .catch(() => {
      console.warn('Autoplay blocked');
    });

  window.removeEventListener('click', initMusic);
});
