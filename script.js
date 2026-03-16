// Danh sách nhạc có sẵn (nếu muốn để sẵn vài bài)
const songs = [{ title: "Bài hát mẫu 1", file: "music/bai1.mp3" },
               {title: "Cho em", file: "https://drive.google.com/uc?export=download&id="}
              
              ];

const audioPlayer = document.getElementById("audio-player");
const playlistElement = document.getElementById("playlist");
const songTitleElement = document.getElementById("song-title");
const recordDisk = document.getElementById("record-disk");
const fileUpload = document.getElementById("file-upload"); // Bắt sự kiện nút tải lên
let currentSongIndex = 0;

// Hàm tải danh sách hiện tại ra màn hình
function loadPlaylist() {
  playlistElement.innerHTML = ""; // Xóa danh sách cũ đi để vẽ lại
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
// TÍNH NĂNG MỚI: XỬ LÝ KHI BẤM "THÊM NHẠC"
// ==========================================
fileUpload.addEventListener("change", function (event) {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Tạo một đường dẫn ảo (URL) cho file nhạc vừa chọn
    const objectURL = URL.createObjectURL(file);

    // Cắt bỏ chữ ".mp3" ở cuối tên file cho đẹp
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");

    // Nhét vào danh sách phát
    songs.push({
      title: cleanTitle,
      file: objectURL,
    });
  }

  // Cập nhật lại giao diện danh sách
  loadPlaylist();

  // Reset lại ô input để lần sau chọn lại file đó vẫn nhận
  fileUpload.value = "";
});

// Các hiệu ứng đĩa quay và tự động chuyển bài
audioPlayer.addEventListener("play", () => {
  recordDisk.style.animationPlayState = "running";
});
audioPlayer.addEventListener("pause", () => {
  recordDisk.style.animationPlayState = "paused";
});
audioPlayer.addEventListener("ended", () => {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  playSong(currentSongIndex);
});

// Chạy lần đầu
loadPlaylist();
const shuffleBtn = document.getElementById("shuffle-btn");
let isShuffle = false; // Mặc định là phát theo thứ tự

// Lắng nghe sự kiện bật/tắt nút Ngẫu nhiên
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle; // Đảo ngược trạng thái
  if (isShuffle) {
    shuffleBtn.classList.add("active");
    shuffleBtn.textContent = "🔀 Bật ngẫu nhiên";
  } else {
    shuffleBtn.classList.remove("active");
    shuffleBtn.textContent = "🔀 Tắt ngẫu nhiên";
  }
});

// Sửa lại đoạn tự động chuyển bài khi bài hát kết thúc
audioPlayer.addEventListener("ended", () => {
  if (isShuffle) {
    // Lấy một con số ngẫu nhiên từ 0 đến tổng số bài hát
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    // Phát theo thứ tự bình thường
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
  }
  playSong(currentSongIndex);
});
