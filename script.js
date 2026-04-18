// script.js - Premium Interactions with Mobile Support
// Images: memory1.jpg to memory10.jpg
// Video: secret-message.mp4
// Music pauses when video plays, resumes on close

let introScreen, mainContent, loadingOverlay, musicAudio, musicBtn;
let loveStartDate = new Date(2023, 5, 15); // CHANGE THIS: Year, Month (0=Jan), Day
let gameScore = 0, gameActive = true;
let wasMusicPlaying = false;

// Check if device is mobile for optimizations
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
  introScreen = document.getElementById('intro-screen');
  mainContent = document.getElementById('main-content');
  loadingOverlay = document.getElementById('loading-overlay');
  musicAudio = document.getElementById('bg-music');
  musicBtn = document.getElementById('toggle-music');
  
  // Hide loading after 1s
  setTimeout(() => {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => loadingOverlay.style.display = 'none', 500);
  }, 1000);
  
  initIntroCanvas();
  
  document.getElementById('enter-btn').addEventListener('click', () => {
    introScreen.style.opacity = '0';
    setTimeout(() => {
      introScreen.style.display = 'none';
      mainContent.style.display = 'block';
      
      musicAudio.volume = 0;
      musicAudio.play().catch(e => console.log('User interaction needed for audio'));
      let fade = setInterval(() => {
        if (musicAudio.volume < 0.7) musicAudio.volume += 0.05;
        else clearInterval(fade);
      }, 200);
      
      initScrollAnimations();
      startTypewriter();
      initGallery();
      initLoveCards();
      initOpenWhen();
      startLoveCounter();
      initGame();
      initStarField();
      initSecretVideo();
    }, 1000);
  });
  
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (musicAudio.paused) {
        musicAudio.play();
        musicBtn.textContent = '⏸️';
      } else {
        musicAudio.pause();
        musicBtn.textContent = '▶️';
      }
    });
  }
  
  // Only enable custom cursor on desktop
  if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
      const cursor = document.querySelector('.cursor-glow');
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    });
  }
});

function initIntroCanvas() {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  let particles = Array(isMobile ? 20 : 40).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 8 + Math.random() * 15,
    speedY: 0.5 + Math.random() * 1.5,
    alpha: 0.5 + Math.random() * 0.4
  }));
  
  function animate() {
    if (!canvas.parentElement) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      if (p.y > canvas.height) p.y = -p.size;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff66b5';
      ctx.fillStyle = `rgba(255, 102, 181, ${p.alpha})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.bezierCurveTo(p.x - p.size/2, p.y - p.size/2, p.x + p.size/2, p.y - p.size/2, p.x, p.y + p.size);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function startTypewriter() {
  const message = `I know I keep saying sorry, and I hate that I've been letting you down.\nI understand if it's not easy for you to forgive me right now.\nBut I need you to know that my love for you is real, Bono.\nI can't imagine my future without you in it.\nI'm working on becoming better, not just for me—but for us.\nI, Lazarus, am truly sorry ❤️`;
  const container = document.getElementById('typewriter-text');
  let i = 0;
  function type() {
    if (i < message.length) {
      container.innerHTML += message.charAt(i);
      i++;
      let delay = 50 + (message.charAt(i-1) === '.' ? 200 : 0);
      setTimeout(type, delay);
    }
  }
  type();
}

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  for (let i = 1; i <= 10; i++) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    const imagePath = `assets/images/memory${i}.jpg`;
    
    div.innerHTML = `
      <img class="gallery-img" 
           src="${imagePath}" 
           alt="Memory ${i}"
           loading="lazy"
           onerror="this.src='https://placehold.co/400x400/ff66b5/white?text=Memory+${i}'">
    `;
    
    div.addEventListener('click', () => {
      openModal(`
        <img src="${imagePath}" 
             style="width:100%; max-width:800px; border-radius:24px; box-shadow:0 0 30px #ff66b5;"
             onerror="this.src='https://placehold.co/800x800/ff66b5/white?text=Memory+${i}'">
        <p style="text-align:center; margin-top:15px; color:#ffb3d9;">💗 Our beautiful memory 💗</p>
      `);
    });
    
    grid.appendChild(div);
  }
  console.log('✅ Gallery loaded with animations');
}

function initLoveCards() {
  const reasons = [
    { title: "Your Smile", msg: "Your smile lights up my darkest days. 💗" },
    { title: "Your Kindness", msg: "You have the purest heart I know. 🌸" },
    { title: "Your Laugh", msg: "It's my favorite melody. 🎵" },
    { title: "Your Strength", msg: "You inspire me every single day. 💪" },
    { title: "Your Eyes", msg: "I get lost in them every time. 👀" },
    { title: "Your Voice", msg: "It's the sweetest sound I know. 🎤" }
  ];
  const container = document.getElementById('love-cards-grid');
  if (!container) return;
  
  reasons.forEach(r => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `<div class="flip-card-inner">
      <div class="flip-front"><h3>💗 ${r.title}</h3></div>
      <div class="flip-back"><p>${r.msg}</p></div>
    </div>`;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    container.appendChild(card);
  });
}

function initOpenWhen() {
  const messages = {
    sad: "You are stronger than any storm. And I'm here, always. 🌈\n\nI believe in you, and I'll always be your biggest supporter. 💗",
    miss: "Every second apart makes my heart grow fonder. I'm counting down to see you again 💫\n\nDistance means so little when someone means so much.",
    unloved: "You are the most loved person in my universe. Never doubt that. 💖\n\nYou deserve all the happiness in the world, Bono."
  };
  document.querySelectorAll('.open-card').forEach(card => {
    card.addEventListener('click', () => {
      const mood = card.dataset.mood;
      const msgDiv = document.getElementById('open-message-display');
      msgDiv.innerHTML = `<div class="glow-text" style="font-size:1rem; line-height:1.5;">✨ ${messages[mood]} ✨</div>`;
      msgDiv.style.opacity = '0';
      setTimeout(() => msgDiv.style.opacity = '1', 50);
    });
  });
}

function startLoveCounter() {
  setInterval(() => {
    const now = new Date();
    const diff = now - loveStartDate;
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (86400000))/3600000);
    const mins = Math.floor((diff % 3600000)/60000);
    const secs = Math.floor((diff % 60000)/1000);
    const counterEl = document.getElementById('love-counter');
    if (counterEl) {
      counterEl.innerHTML = `${days}d ${hours}h ${mins}m ${secs}s`;
    }
  }, 1000);
}

function initGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Set canvas size for mobile
  const setCanvasSize = () => {
    const container = canvas.parentElement;
    const maxWidth = Math.min(500, window.innerWidth - 40);
    canvas.width = maxWidth;
    canvas.height = maxWidth * 0.6;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
  };
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);
  
  let fallingHearts = [];
  
  function createHeart() {
    fallingHearts.push({ x: Math.random() * canvas.width, y: 0, size: 20, speed: 1.5 + Math.random() * 2 });
  }
  
  const heartInterval = setInterval(createHeart, 800);
  
  function draw() {
    if (!gameActive) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fallingHearts.forEach((h, idx) => {
      h.y += h.speed;
      ctx.fillStyle = '#ff66b5';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff3399';
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(h.x - h.size/2, h.y - h.size/2, h.x + h.size/2, h.y - h.size/2, h.x, h.y + h.size);
      ctx.fill();
      if (h.y > canvas.height) fallingHearts.splice(idx,1);
    });
    requestAnimationFrame(draw);
  }
  draw();
  
  const handleClick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX, clientY;
    
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;
    
    for (let i=0; i<fallingHearts.length; i++) {
      const h = fallingHearts[i];
      const dx = mouseX - h.x;
      const dy = mouseY - h.y;
      if (Math.hypot(dx,dy) < h.size && gameActive) {
        fallingHearts.splice(i,1);
        gameScore++;
        const scoreEl = document.getElementById('game-score');
        if (scoreEl) scoreEl.innerText = `Score: ${gameScore} / 10`;
        
        if (gameScore >= 10) {
          gameActive = false;
          clearInterval(heartInterval);
          const msgEl = document.getElementById('game-message');
          if (msgEl) msgEl.innerHTML = '<div class="glow-text" style="font-size:1.2rem;">💗 You\'ve captured my heart 💗</div>';
        }
        break;
      }
    }
  };
  
  canvas.addEventListener('click', handleClick);
  canvas.addEventListener('touchstart', handleClick);
}

function initStarField() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  let stars = Array(isMobile ? 100 : 200).fill().map(() => ({ 
    x: Math.random() * canvas.width, 
    y: Math.random() * canvas.height, 
    radius: Math.random() * 2, 
    alpha: 0.3 + Math.random() * 0.7,
    twinkle: 0.01 + Math.random() * 0.03
  }));
  
  function drawStars() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
      s.alpha += s.twinkle * (Math.random() > 0.5 ? 0.02 : -0.02);
      s.alpha = Math.min(0.9, Math.max(0.2, s.alpha));
      ctx.fillStyle = `rgba(255, 179, 217, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initSecretVideo() {
  const btn = document.getElementById('secret-video-btn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    wasMusicPlaying = !musicAudio.paused;
    
    if (!musicAudio.paused) {
      musicAudio.pause();
      if (musicBtn) musicBtn.textContent = '▶️';
    }
    
    const modalContent = `
      <video id="secret-video" controls autoplay playsinline style="width:100%; max-width:800px; border-radius:24px; box-shadow:0 0 30px #ff66b5;">
        <source src="assets/video/secret-message.mp4" type="video/mp4">
        <p>💗 Video not found. Make sure secret-message.mp4 is in assets/video/ folder 💗</p>
      </video>
      <p style="text-align:center; margin-top:15px; color:#ffb3d9;">❤️ A special message just for you, Bono ❤️</p>
    `;
    
    openModalWithVideo(modalContent);
  });
}

function openModalWithVideo(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = content;
  modal.style.display = 'flex';
  
  const video = document.getElementById('secret-video');
  
  const closeModal = () => {
    modal.style.display = 'none';
    if (wasMusicPlaying) {
      musicAudio.play().catch(e => console.log('Could not resume music'));
      if (musicBtn) musicBtn.textContent = '⏸️';
    }
    if (video) video.pause();
  };
  
  const closeBtn = document.querySelector('.close-modal');
  if (closeBtn) closeBtn.onclick = closeModal;
  
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function openModal(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = content;
  modal.style.display = 'flex';
  
  const closeModal = () => modal.style.display = 'none';
  const closeBtn = document.querySelector('.close-modal');
  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  sections.forEach(s => observer.observe(s));
}