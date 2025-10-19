// === assets/script.js ===
// Toàn bộ hiệu ứng cho website 20/10:
// - Nền vũ trụ voxel động (Three.js)
// - Hiệu ứng tim bay 💖
// - Tin nhắn rơi lần lượt
// - Hiệu ứng phim trượt
// - Lá thư bay và mở ra với dòng chữ "Thương em lắm bé xã 💌"

const startButtonId = 'startButton';
const messagesId = 'messages';
const cinemaId = 'film-strip';
const bgMusicId = 'bgMusic';
const threeCanvasId = 'three-canvas';
const heartCanvasId = 'heart-canvas';

let bgMusic, msgContainer, filmStrip, filmImgs, filmIndex = 0;
let renderer, scene, camera, blocksGroup;
let clock = new THREE.Clock();
let heartCanvas, heartCtx, heartParticles = [];

// ----------------------
// DOM khởi tạo
// ----------------------
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById(startButtonId);
    bgMusic = document.getElementById(bgMusicId);
    msgContainer = document.getElementById(messagesId);
    filmStrip = document.getElementById(cinemaId);
    filmImgs = document.querySelectorAll('#film-strip .film-img');

    document.getElementById('cinema').style.display = 'none';

    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        console.log('💝 Bắt đầu trải nghiệm 20/10...');

        if (bgMusic) {
            bgMusic.volume = 0.7;
            bgMusic.play().catch(() => {});
        }

        document.getElementById('intro').style.display = 'none';
        initThree();
        initHeartCanvas();
        startHeartLoop();
        runMessagesSequence();
    });
});

// ----------------------
// Vũ trụ voxel động (Three.js)
// ----------------------
function initThree() {
    const canvas = document.getElementById(threeCanvasId);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 20, 90);

    const amb = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(amb);
    const point = new THREE.PointLight(0xff66cc, 1.2, 500);
    point.position.set(50, 50, 80);
    scene.add(point);

    blocksGroup = new THREE.Group();
    scene.add(blocksGroup);

    const boxGeom = new THREE.BoxGeometry(4, 4, 4);
    for (let x = -12; x <= 12; x += 4) {
        for (let z = -40; z <= 40; z += 6) {
            const mat = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random() * 0.8 + 0.1, 0.6, 0.45),
                metalness: 0.3,
                roughness: 0.4,
                transparent: true,
                opacity: 0.95
            });
            const box = new THREE.Mesh(boxGeom, mat);
            box.position.set(x + (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 8, z + (Math.random() - 0.5) * 2);
            box.scale.y = Math.random() * 2 + 0.4;
            blocksGroup.add(box);
        }
    }

    scene.fog = new THREE.FogExp2(0x000010, 0.0025);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    animateThree();
}

function animateThree() {
    requestAnimationFrame(animateThree);
    const t = clock.getElapsedTime();

    camera.position.x = Math.sin(t * 0.08) * 40;
    camera.position.y = 18 + Math.sin(t * 0.12) * 6;
    camera.lookAt(0, 0, 0);

    blocksGroup.children.forEach((b, i) => {
        const s = 1 + Math.sin(t * 1.2 + i * 0.02) * 0.15;
        b.scale.y = Math.max(0.2, b.scale.y * 0.98) * s;
        const h = (Math.sin(t * 0.2 + i * 0.01) * 0.5 + 0.5) * 0.8;
        b.material.color.setHSL(h, 0.6, 0.45 + Math.sin(t * 0.3 + i * 0.02) * 0.06);
        b.position.z += 0.04 + Math.sin(t * 0.5 + i * 0.01) * 0.01;
        if (b.position.z > 60) b.position.z = -60;
    });

    renderer.render(scene, camera);
}

// ----------------------
// Tim bay 💕
// ----------------------
function initHeartCanvas() {
    heartCanvas = document.getElementById(heartCanvasId);
    heartCtx = heartCanvas.getContext('2d');
    heartCanvas.width = innerWidth;
    heartCanvas.height = innerHeight;
    window.addEventListener('resize', () => {
        heartCanvas.width = innerWidth;
        heartCanvas.height = innerHeight;
    });
}

function drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.bezierCurveTo(2, -10, 12, -10, 12, -2);
    ctx.bezierCurveTo(12, 6, 6, 10, 0, 14);
    ctx.bezierCurveTo(-6, 10, -12, 6, -12, -2);
    ctx.bezierCurveTo(-12, -10, -2, -10, 0, -4);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function spawnHeartExplosion(x = null, y = null) {
    if (!x) x = Math.random() * (innerWidth * 0.7) + innerWidth * 0.15;
    if (!y) y = innerHeight * (0.35 + Math.random() * 0.4);
    heartParticles.push({
        type: 'pulse',
        x, y,
        r: 0.6 + Math.random() * 0.4,
        life: 60,
        hue: Math.floor(Math.random() * 40) + 330
    });
}

function spawnMiniHearts(cx, cy, hue) {
    const count = 18 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.2;
        heartParticles.push({
            type: 'mini',
            x: cx,
            y: cy,
            vx: Math.cos(ang) * speed,
            vy: Math.sin(ang) * speed - 1.2,
            life: 80 + Math.random() * 40,
            size: 0.9 + Math.random() * 0.9,
            hue
        });
    }
}

function startHeartLoop() {
    setInterval(() => spawnHeartExplosion(), 900);

    (function loop() {
        requestAnimationFrame(loop);
        heartCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

        for (let i = heartParticles.length - 1; i >= 0; i--) {
            const p = heartParticles[i];
            if (p.type === 'pulse') {
                p.life--;
                const alpha = p.life / 60;
                drawHeart(heartCtx, p.x, p.y - (60 - p.life) * 0.2, p.r * (1 + (1 - alpha) * 0.8), `hsla(${p.hue},90%,60%,${0.6 * alpha})`);
                if (p.life === 10) spawnMiniHearts(p.x, p.y, p.hue);
                if (p.life <= 0) heartParticles.splice(i, 1);
            } else if (p.type === 'mini') {
                p.life--;
                p.vy += 0.04;
                p.x += p.vx;
                p.y += p.vy;
                const a = Math.max(0, p.life / 120);
                drawHeart(heartCtx, p.x, p.y, p.size * 0.08, `hsla(${p.hue},90%,60%,${a})`);
                heartCtx.beginPath();
                heartCtx.fillStyle = `rgba(255,200,230,${0.06 * a})`;
                heartCtx.arc(p.x, p.y, 10 * a, 0, Math.PI * 2);
                heartCtx.fill();
                if (p.life <= 0) heartParticles.splice(i, 1);
            }
        }
    })();
}

// ----------------------
// Tin nhắn rơi lần lượt
// ----------------------
function runMessagesSequence() {
    msgContainer.classList.remove('hidden');
    const msgs = Array.from(msgContainer.querySelectorAll('.msg'));
    const delay = 2800;

    msgs.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('show');
            const rect = el.getBoundingClientRect();
            spawnHeartExplosion(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5);
        }, i * delay);
        setTimeout(() => el.classList.remove('show'), i * delay + delay - 600);
    });

    const total = msgs.length * delay;
    setTimeout(() => {
        msgContainer.classList.add('hidden');
        startCinema();
    }, total + 300);
}

// ----------------------
// Hiệu ứng phim và kết thúc
// ----------------------
function startCinema() {
    const cinemaWrapper = document.getElementById('cinema');
    cinemaWrapper.style.display = 'block';
    const imgs = Array.from(filmImgs);
    filmStrip.style.transform = `translateX(-100%)`;
    let totalW = 0;
    imgs.forEach(im => totalW += im.getBoundingClientRect().width + 36);
    const duration = 10000;
    const start = performance.now();

    function loop(now) {
        const elapsed = (now - start) % duration;
        const pct = elapsed / duration;
        const containerW = cinemaWrapper.clientWidth;
        const translateX = -containerW + (containerW + totalW) * pct;
        filmStrip.style.transform = `translateX(${translateX}px)`;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    setTimeout(() => {
        cinemaWrapper.style.display = 'none';
        document.getElementById('final').classList.remove('hidden');
    }, 15000);
}

// ----------------------
// Lá thư bay + dòng chữ tình cảm 💌
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendLove');
    if (sendBtn) sendBtn.addEventListener('click', flyLetter);
});

function flyLetter() {
    const letter = document.createElement('div');
    letter.className = 'flying-letter';
    letter.innerHTML = '💌';
    document.body.appendChild(letter);

    // Bay và mở
    setTimeout(() => {
        letter.classList.add('open');
        letter.innerHTML = `
            <div class="letter-content">
                <p>Thương em lắm bé xã 💖</p>
            </div>
        `;
    }, 2500);

    // Xóa thư
    setTimeout(() => letter.remove(), 8000);
}
