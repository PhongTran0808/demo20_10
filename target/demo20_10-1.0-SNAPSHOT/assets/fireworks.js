// === firework.js ===
// Universe of Love 🌌💖
// Nền vũ trụ xoắn ốc nhiều màu + 4 dòng sông trái tim đổ về trung tâm + thư bay + pháo hoa

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

let scene, camera, renderer, galaxy, clock, heartStreams = [];

// ======== 1️⃣ KHỞI TẠO VŨ TRỤ ========
function initUniverse() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("bg"),
        antialias: true,
        alpha: false
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // === Vũ trụ xoắn ốc ===
    const geometry = new THREE.BufferGeometry();
    const starCount = 6000;
    const positions = [];
    const colors = [];

    for (let i = 0; i < starCount; i++) {
        const arm = i % 3; // 3 nhánh chính
        const angle = i * 0.25 + arm * (Math.PI * 2 / 3);
        const radius = Math.sqrt(i) * 10;
        const spiral = 0.08 * i;

        const x = Math.cos(angle + spiral) * radius;
        const y = (Math.random() - 0.5) * 150;
        const z = Math.sin(angle + spiral) * radius;

        positions.push(x, y, z);

        const hue = (i / starCount) * 360;
        const color = new THREE.Color(`hsl(${hue}, 100%, 75%)`);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    // === Tạo 4 dòng sông trái tim đổ về trung tâm ===
    createHeartStreams();

    animate();
}

// ======== 2️⃣ DÒNG SÔNG TRÁI TIM ========
function createHeartStreams() {
    const heartShape = new THREE.Shape();

    const x = 0, y = 0;
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 13, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geometry = new THREE.ShapeGeometry(heartShape);
    const colors = [0xff4da6, 0xff99cc, 0xffcce6, 0xff66b2];

    for (let i = 0; i < 4; i++) {
        const material = new THREE.MeshBasicMaterial({
            color: colors[i],
            transparent: true,
            opacity: 0.85,
            side: THREE.DoubleSide
        });

        const heart = new THREE.Mesh(geometry, material);
        heart.scale.set(10, 10, 10);
        heart.position.set(Math.cos(i * Math.PI / 2) * 600, Math.sin(i * Math.PI / 2) * 400, -200);
        scene.add(heart);
        heartStreams.push(heart);
    }
}

// ======== 3️⃣ ANIMATION ========
function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    galaxy.rotation.y += 0.0007;
    galaxy.rotation.x = Math.sin(t * 0.2) * 0.05;

    // Dòng sông trái tim di chuyển theo xoắn ốc
    heartStreams.forEach((h, i) => {
        const r = 600 - (Math.sin(t * 0.5 + i) * 100);
        const angle = t * 0.4 + i * (Math.PI / 2);
        h.position.x = Math.cos(angle) * r;
        h.position.y = Math.sin(angle) * r * 0.7;
        h.position.z = Math.sin(t * 2 + i) * 200;
        h.rotation.z += 0.02;
    });

    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ======== 4️⃣ LÁ THƯ BAY + DÒNG CHỮ ========
document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("sendBtn");
    const loveMessage = document.getElementById("loveMessage");

    sendBtn.addEventListener("click", () => {
        const letter = document.createElement("div");
        letter.classList.add("flying-letter");
        letter.innerHTML = `
            <div class="letter-envelope">
                <div class="letter-content">
                    <p>Thương em lắm bé xã 💖</p>
                </div>
            </div>
        `;
        document.body.appendChild(letter);

        setTimeout(() => {
            letter.classList.add("open");
            setTimeout(() => {
                loveMessage.textContent = "Yêu em lắm bé xã 💖";
                loveMessage.style.opacity = 1;
                loveMessage.style.transform = "scale(1)";
            }, 1500);
        }, 2500);

        startFireworks();
    });
});

// ======== 5️⃣ PHÁO HOA ========
function startFireworks() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = 999;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const fireworks = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createFirework() {
        const x = random(0, w);
        const y = random(h * 0.2, h * 0.7);
        const colors = ["#ff77b9", "#ff4d94", "#ffd6ea", "#fffacd", "#ffb6c1"];
        for (let i = 0; i < 40; i++) {
            fireworks.push({
                x,
                y,
                vx: random(-3, 3),
                vy: random(-3, 3),
                alpha: 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    function updateFireworks() {
        ctx.clearRect(0, 0, w, h);
        fireworks.forEach((f, i) => {
            f.x += f.vx;
            f.y += f.vy;
            f.alpha -= 0.02;
            ctx.globalAlpha = f.alpha;
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, 3, 0, 2 * Math.PI);
            ctx.fill();
            if (f.alpha <= 0) fireworks.splice(i, 1);
        });
        if (Math.random() < 0.04) createFirework();
        requestAnimationFrame(updateFireworks);
    }

    updateFireworks();
}

// ======== 6️⃣ KHỞI TẠO ========
initUniverse();
