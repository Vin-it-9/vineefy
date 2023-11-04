const wrapper = document.querySelector(".wrapper");
const musicImg = wrapper.querySelector(".img-area img");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const mainAudio = document.querySelector("#main-audio");
const progressArea = document.querySelector(".progress-area");
const progressBar = progressArea.querySelector(".progress-bar");
const musicList = document.querySelector(".music-list");
const moreMusicBtn = document.querySelector("#more-music");
const closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length) + 1;
let isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNumb) {
  const music = allMusic[indexNumb - 1];
  musicName.innerText = music.name;
  musicArtist.innerText = music.artist;
  musicImg.src = `images/${music.src}.jpg`;
  mainAudio.src = `songs/${music.src}.mp3`;
}

function togglePlayPause() {
  if (isMusicPaused) {
    playMusic();
  } else {
    pauseMusic();
  }
  playingSong();
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  isMusicPaused = false;
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
  isMusicPaused = true;
}

function prevMusic() {
  musicIndex = (musicIndex - 1) < 1 ? allMusic.length : musicIndex - 1;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

function nextMusic() {
  musicIndex = (musicIndex + 1) > allMusic.length ? 1 : musicIndex + 1;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  const progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  const musicCurrentTime = wrapper.querySelector(".current-time");
  const musicDuration = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    const totalMin = Math.floor(mainAudio.duration / 60);
    const totalSec = Math.floor(mainAudio.duration % 60);
    const formattedTotalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
    musicDuration.innerText = `${totalMin}:${formattedTotalSec}`;
  });

  const currentMin = Math.floor(currentTime / 60);
  const currentSec = Math.floor(currentTime % 60);
  const formattedCurrentSec = currentSec < 10 ? `0${currentSec}` : currentSec;
  musicCurrentTime.innerText = `${currentMin}:${formattedCurrentSec}`;
});

progressArea.addEventListener("click", (e) => {
  const progressWidth = progressArea.clientWidth;
  const clickedOffsetX = e.offsetX;
  const songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  playingSong();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  const getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  const getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex;
      do {
        randIndex = Math.floor(Math.random() * allMusic.length) + 1;
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  const liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  const liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  const liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    const duration = liAudioTag.duration;
    const totalMin = Math.floor(duration / 60);
    const totalSec = Math.floor(duration % 60);
    const formattedTotalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
    liAudioDurationTag.innerText = `${totalMin}:${formattedTotalSec}`;
    liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${formattedTotalSec}`);
  });
}

function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");
  for (let j = 0; j < allLiTag.length; j++) {
    const audioTag = allLiTag[j].querySelector(".audio-duration");
    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      const adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  const getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
