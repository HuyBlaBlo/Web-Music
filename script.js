// Link API quét nhạc tự động từ Drive của bạn
const apiURL = "https://script.google.com/macros/s/AKfycbw1ZBYw52jdK8lwK4MPGTR3xzvQnfd-lz-wiynX6LsY5bmt8XyEbCPrXSSDVrghZjU76g/exec";

// Chuyển thành 'let' và để mảng rỗng để hứng dữ liệu từ Drive về
let songs = []; 

const audioPlayer = document.getElementById("audio-player");
const playlistElement = document.getElementById("playlist");
const songTitleElement = document.getElementById("song-title");
const recordDisk = document.getElementById("record-disk");
const fileUpload = document.getElementById("file-upload"); 
const shuffleBtn = document.getElementById("shuffle-btn");

let currentSongIndex = 0;
let isShuffle = false; 

// ==========================================
// 1. KẾT NỐI API LẤY NHẠC TỪ GOOGLE DRIVE
// ==========================================
async function fetchSongsFromDrive() {
  songTitleElement.textContent = "⏳ Đang đồng bộ nhạc từ Cloud...";
  try {
    const response = await fetch(apiURL);
    songs = await response.json(); // Lấy xong dữ liệu từ Drive
    
    if (songs.length > 0) {
      loadPlaylist();
      songTitleElement.textContent = "🎧 Hãy chọn một bài hát...";
    } else {
      songTitleElement.textContent = "Thư mục Drive đang trống!";
    }
  } catch (error) {
    songTitleElement.textContent = "❌ Lỗi kết nối đến Drive!";
    console.error("Lỗi:", error);
  }
}

// ==========================================
// 2. HIỂN THỊ DANH SÁCH VÀ PHÁT NHẠC
// ==========================================
function loadPlaylist() {
  playlistElement.innerHTML = ""; 
  songs.forEach((song, index) => {
    let li = document.createElement("li");
    li.textContent = "🎧 " + song.title;
    li.onclick = () => playSong(index);
    playlistElement.appendChild(li);
  });
}

function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];

  audioPlayer.src = song.file;
  songTitleElement.textContent = song.title;
  audioPlayer.play();

  let allItems = document.querySelectorAll(".playlist li");
  allItems.forEach((item) => item.classList.remove("active"));
  allItems[index].classList.add("active");
}

// ==========================================
// 3. TÍNH NĂNG TẢI NHẠC TỪ MÁY (DỰ PHÒNG)
// ==========================================
fileUpload.addEventListener("change", function (event) {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const objectURL = URL.createObjectURL(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

    songs.push({
      title: cleanTitle,
      file: objectURL,
    });
  }
  loadPlaylist();
  fileUpload.value = "";
});

// ==========================================
// 4. TÍNH NĂNG SHUFFLE (NGẪU NHIÊN)
// ==========================================
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle; 
  if (isShuffle) {
    shuffleBtn.classList.add("active");
    shuffleBtn.textContent = "🔀 Bật ngẫu nhiên";
  } else {
    shuffleBtn.classList.remove("active");
    shuffleBtn.textContent = "🔀 Tắt ngẫu nhiên";
  }
});

// ==========================================
// 5. HIỆU ỨNG VÀ TỰ ĐỘNG CHUYỂN BÀI
// ==========================================
audioPlayer.addEventListener("play", () => {
  recordDisk.style.animationPlayState = "running";
});
audioPlayer.addEventListener("pause", () => {
  recordDisk.style.animationPlayState = "paused";
});

// Đã gộp logic chuyển bài theo thứ tự và ngẫu nhiên vào 1 sự kiện duy nhất
audioPlayer.addEventListener("ended", () => {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
  }
  playSong(currentSongIndex);
});

// ==========================================
// KÍCH HOẠT HỆ THỐNG KHI MỞ WEB
// ==========================================
fetchSongsFromDrive();
