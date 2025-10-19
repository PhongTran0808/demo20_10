<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>💗 Chúc mừng ngày 20/10 💗</title>

    <!-- CSS chính -->
    <link rel="stylesheet" href="style.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Rubik:wght@300;500;700&display=swap" rel="stylesheet">
</head>

<body>
<!-- Màn mở đầu -->
<div id="intro">
    <h1 class="title">💗 Chúc mừng ngày 20/10 💗</h1>
    <p class="subtitle">Dành tặng riêng em — người con gái anh yêu</p>
    <button id="startButton" class="btn">BẮT ĐẦU</button>
</div>

<!-- Canvas nền 3D (vũ trụ xoắn ốc) -->
<canvas id="three-canvas"></canvas>

<!-- Canvas hiệu ứng tim -->
<canvas id="heart-canvas"></canvas>

<!-- Lời nhắn -->
<div id="messages" class="hidden">
    <div class="msg" data-index="1">1. Chúc em luôn xinh đẹp, hạnh phúc và rạng rỡ như ánh bình minh 🌸</div>
    <div class="msg" data-index="2">2. Cảm ơn em đã đến và làm trái tim anh rung động 💓</div>
    <div class="msg" data-index="3">3. Mỗi ngày có em là một điều tuyệt vời nhất 💐</div>
    <div class="msg" data-index="4">4. Chúc em luôn tỏa sáng và thành công trong mọi điều em làm 🌟</div>
    <div class="msg" data-index="5">5. Anh may mắn khi có em trong đời 💞</div>
    <div class="msg" data-index="6">6. Mong em luôn cười thật tươi như hôm nay 💕</div>
    <div class="msg" data-index="7">7. Dù ở đâu, anh vẫn luôn nghĩ về em 💖</div>
    <div class="msg" data-index="8">8. Chúc em 20/10 thật ý nghĩa và tràn ngập yêu thương 🌹</div>
    <div class="msg" data-index="9">9. Em là bông hoa đẹp nhất giữa khu vườn cuộc sống của anh 🌺</div>
    <div class="msg" data-index="10">10. Yêu em 💗</div>
</div>

<!-- Phim ảnh kỷ niệm (rạp chiếu) -->
<div id="cinema">
    <div id="film-strip">
        <img src="assets/anh1.jpg" class="film-img" alt="Ảnh 1">
        <img src="assets/anh2.jpg" class="film-img" alt="Ảnh 2">
        <img src="assets/anh3.jpg" class="film-img" alt="Ảnh 3">
        <img src="assets/anh4.jpg" class="film-img" alt="Ảnh 4">
        <img src="assets/anh5.jpg" class="film-img" alt="Ảnh 5">
    </div>
</div>

<!-- Thông điệp cuối -->
<div id="final" class="hidden">
    <h2>20/10 — Dành tặng em</h2>
    <p class="final-text">
        Cảm ơn em vì đã làm cho thế giới của anh trở nên tuyệt vời.
        Chúc em 20/10 thật hạnh phúc, em yêu! 💕
    </p>
    <button id="sendLove" class="btn">Gửi đến em 💌</button>
</div>

<!-- Âm nhạc nền -->
<audio id="bgMusic" src="assets/music.mp3" loop preload="auto"></audio>

<!-- JS thư viện & logic -->
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>

<!-- Universe (vũ trụ xoắn ốc - module riêng) -->
<script type="module" src="assets/universe.js"></script>

<!-- Hiệu ứng pháo hoa -->
<script src="assets/firework.js"></script>

<!-- Logic chính -->
<script src="assets/script.js"></script>
</body>
</html>
