// === universe.js ===
// Hiệu ứng vũ trụ xoắn ốc nhiều màu + 4 dòng sông trái tim đổ về trung tâm 💖
// Nền đen, vũ trụ xoay theo thời gian, ánh sáng và màu thay đổi tự nhiên

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

let scene, camera, renderer, galaxy, clock;
let heartStreams = [];

// ----------------------
// Tạo dải sao vũ trụ xoắn ốc
// ----------------------
function createGalaxy() {
    const geometry = new THREE.BufferGeometry();
    const starCount = 9000;

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorSets = [
        new THREE.Color(0xff66cc), // hồng
        new THREE.Color(0x66ccff), // xanh
        new THREE.Color(0xffff99), // vàng nhạt
        new THREE.Color(0xcc99ff), // tím
        new THREE.Color(0xffffff)  // trắng
    ];

    for (let i = 0; i < starCount; i++) {
        const radius = Math.random() * 400;
        const branch = i % 5;
        const spin = radius * 0.25;
        const angle = (branch / 5) * Math.PI * 2 + spin;

        const randomX = (Math.random() - 0.5) * 30;
        const randomY = (Math.random() - 0.5) * 40;
        const randomZ = (Math.random() - 0.5) * 30;

        const i3 = i * 3;
        positions[i3] = Math.cos(angle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(angle) * radius + randomZ;

        const baseColor = colorSets[Math.floor(Math.random() * colorSets.length)];
        const c = baseColor.clone().lerp(new THREE.Color(0x000000), radius / 400);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);
}

// ----------------------
// Tạo 4 dòng sông trái tim đổ về trung tâm
// ----------------------
function createHeartStreams() {
    const heartGeom = new THREE.BufferGeometry();
    const heartMat = new THREE.PointsMaterial({
        size: 3.5,
        color: 0xff4da6,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    // 4 hướng đối xứng
    const dirs = [
        new THREE.Vector3(1, 0.2, 0.5),
        new THREE.Vector3(-1, 0.3, -0.6),
        new THREE.Vector3(0.6, -0.1, -1),
        new THREE.Vector3(-0.7, 0.4, 1)
    ];

    dirs.forEach((dir, j) => {
        const count = 1500;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = t * Math.PI * 2;
            const r = 300 * (1 - t);
            const i3 = i * 3;
            positions[i3] = Math.cos(angle) * r * dir.x + Math.sin(angle * 2) * 10;
            positions[i3 + 1] = Math.sin(angle * 1.3) * 40 * dir.y;
            positions[i3 + 2] = Math.sin(angle) * r * dir.z + Math.cos(angle * 1.5) * 10;
        }

        heartGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const stream = new THREE.Points(heartGeom.clone(), heartMat.clone());
        stream.rotation.y = j * Math.PI / 2;
        scene.add(stream);
        heartStreams.push(stream);
    });
}

// ----------------------
// Khởi tạo vũ trụ
// ----------------------
function initUniverse() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 80, 600);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    createGalaxy();
    createHeartStreams();
    animate();
}

// ----------------------
// Vòng lặp chuyển động
// ----------------------
function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Xoay galaxy
    galaxy.rotation.y += 0.0008;
    galaxy.rotation.x = Math.sin(elapsed * 0.2) * 0.05;

    // Dòng sông tim chuyển động nhịp nhàng
    heartStreams.forEach((s, i) => {
        s.rotation.y += 0.0015 + Math.sin(elapsed * 0.3 + i) * 0.0005;
        s.rotation.x = Math.sin(elapsed * 0.5 + i) * 0.03;
        s.material.opacity = 0.7 + Math.sin(elapsed * 2 + i) * 0.2;
        s.material.color.setHSL((0.9 + Math.sin(elapsed + i) * 0.05), 0.8, 0.6);
    });

    // Camera xoay quanh tâm tạo cảm giác xoắn ốc
    camera.position.x = Math.sin(elapsed * 0.12) * 600;
    camera.position.z = Math.cos(elapsed * 0.12) * 600;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

// ----------------------
// Xử lý thay đổi kích thước
// ----------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----------------------
// Bắt đầu khởi tạo
// ----------------------
initUniverse();

// === Nhạc nền xuyên suốt ===
const bgMusic = new Audio('assets/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.35;

// Tự động phát khi người dùng tương tác lần đầu (để tránh bị chặn autoplay)
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
    }
});

// Nút bật / tắt nhạc 🎵
const musicToggle = document.createElement('button');
musicToggle.innerText = '🔊';
musicToggle.style.position = 'fixed';
musicToggle.style.bottom = '20px';
musicToggle.style.right = '20px';
musicToggle.style.fontSize = '26px';
musicToggle.style.color = '#fff';
musicToggle.style.background = 'rgba(0,0,0,0.3)';
musicToggle.style.border = '2px solid #ff66b2';
musicToggle.style.borderRadius = '50%';
musicToggle.style.width = '50px';
musicToggle.style.height = '50px';
musicToggle.style.cursor = 'pointer';
musicToggle.style.boxShadow = '0 0 15px #ff99cc';
musicToggle.style.zIndex = '9999';
document.body.appendChild(musicToggle);

let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerText = '🔇';
    } else {
        bgMusic.play();
        musicToggle.innerText = '🔊';
    }
    isPlaying = !isPlaying;
});
