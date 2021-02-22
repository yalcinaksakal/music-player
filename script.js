const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");

const playBTtn = document.getElementById("play");
const btnContainer = document.querySelector(".player-controls");

const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const volumeEl = document.querySelector(".volume-bar");
const volumeBar = document.querySelector(".volume");

const muteButton = document.getElementById("mute");

let volume = 0.5;

let duration = 0;
const songs = [
  { name: "jacinto-1", displayName: "Chill Machine", artist: "Jacinto" },
  {
    name: "jacinto-2",
    displayName: "7 Nation Army (Remix)",
    artist: "Jacinto",
  },
  { name: "jacinto-3", displayName: "Good Night", artist: "Jacinto" },
  { name: "metric-1", displayName: "Front Row (Remix)", artist: "Metric" },
];

let isPlaying = false;

function playSong() {
  music.play();
  isPlaying = true;
  playBTtn.classList.replace("fa-play", "fa-pause");
  playBTtn.setAttribute("title", "Pause");
}
function pauseSong() {
  music.pause();
  isPlaying = false;
  playBTtn.classList.replace("fa-pause", "fa-play");
  playBTtn.setAttribute("title", "Play");
}

function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
  music.onloadedmetadata = () =>
    (durationEl.textContent = toMinuteAndSecs(Math.floor(music.duration)));
}

let songIndex = 0;
loadSong(songs[songIndex]);

function nextSong(direction = "next") {
  songIndex = (songIndex + (direction === "prev" ? -1 : 1) + 4) % 4;
}

function changeSong(direction = null) {
  nextSong(direction);
  loadSong(songs[songIndex]);
  playSong();
  updateProgressBar();
}

btnContainer.addEventListener("click", e => {
  const btn = e.target.closest(".fas");
  if (!btn) return;
  if (btn.id === "play") {
    isPlaying ? pauseSong() : playSong();
    return;
  }
  changeSong(btn.id);
});

const toMinuteAndSecs = sec =>
  `${Math.floor(sec / 60)}:${((sec % 60) + "").padStart(2, "0")}`;

function updateProgressBar(e = null) {
  if (isPlaying) {
    const { duration, currentTime } = e
      ? e.srcElement
      : { duration: 1, currentTime: 0 };
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = toMinuteAndSecs(Math.floor(currentTime));
  }
}

music.addEventListener("timeupdate", updateProgressBar);

function setProgressBar(e) {
  music.currentTime = (e.offsetX * music.duration) / this.clientWidth;
  playSong();
}

progressContainer.addEventListener("click", setProgressBar);

music.addEventListener("ended", () => {
  changeSong();
});

music.volume = volume;

function setVolumeBar(e) {
    
  volumeBar.style.width = `${e.offsetX}%`;
  e.offsetX > 85
    ? (volumeBar.style.background = "#ec4242")
    : (volumeBar.style.background = "#90e27d");
  volume = e.offsetX > 0 ? e.offsetX / 100 : 0;
  music.volume = volume;
  if (muteButton.classList.contains("fa-volume-mute")) toggleMute();
}

function toggleMute() {
  if (muteButton.classList.contains("fa-volume-up")) {
    muteButton.classList.replace("fa-volume-up", "fa-volume-mute");
    volumeBar.style.background = "rgb(129, 129, 129)";
    music.volume = 0;

    return;
  }
  muteButton.classList.replace("fa-volume-mute", "fa-volume-up");
  volume > 0.85
    ? (volumeBar.style.background = "#ec4242")
    : (volumeBar.style.background = "#90e27d");
  music.volume = volume;
}

volumeEl.addEventListener("click", setVolumeBar);
muteButton.addEventListener("click", toggleMute);
