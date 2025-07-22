const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const dots = [];
const dotCount = 120;
const mouse = { x: null, y: null, radius: 150 };

// Create dots
class Dot {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#111"; // black-ish
    ctx.fill();
  }
}

for (let i = 0; i < dotCount; i++) {
  dots.push(new Dot());
}

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

function drawLines(dot) {
  dots.forEach(other => {
    const dx = dot.x - other.x;
    const dy = dot.y - other.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(other.x, other.y);
      ctx.strokeStyle = `rgba(0, 0, 0, ${1 - dist / 100})`; // gray-black
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    if (mouse.x && mouse.y) {
      const mdist = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
      if (mdist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${1 - mdist / mouse.radius})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  dots.forEach(dot => {
    dot.update();
    dot.draw();
    drawLines(dot);
  });
  requestAnimationFrame(animate);
}

animate();