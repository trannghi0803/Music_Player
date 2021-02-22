const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "MY MUSIC";
const cd = $(".cd");
const playList = $(".playlist");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const timeLeft = $(".timeLeft");
const timeRight = $(".timeRight");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const volumeBtn = $(".volume");
const muteBtn = $(".mute");
const changeVolumeBtn = $(".volumeBar");
var oldIndex = [0];
var cdSongThumb;
const app = {
  currentIndex: 0,
  isPlaying: false,
  isTimeUpdate: true,
  isRandom: false,
  isRepeat: false,
  pastSong: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Hoa Nở Không Màu",
      singer: "Hoài Lâm",
      path: "./../../assets/music/Hoa Nở Không Màu - Hoài Lâm.mp3",
      image: "./../../assets/img/2.jpg",
    },
    {
      name: "THẾ GIỚI MẤT ĐI MỘT NGƯỜI",
      singer: "TĂNG PHÚC",
      path: "./../../assets/music/THẾ GIỚI MẤT ĐI MỘT NGƯỜI - TĂNG PHÚC.mp3",
      image: "./../../assets/img/3.jpg",
    },
    {
      name: "TA TỪNG TỒN TẠI",
      singer: "Đạt Khói",
      path: "./../../assets/music/TA TỪNG TỒN TẠI.mp3",
      image: "./../../assets/img/1.jpg",
    },
    {
      name: "Yêu Một Người Tổn Thương",
      singer: "Nhật Phong",
      path: "./../../assets/music/Nhật Phong - Yêu Một Người Tổn Thương.mp3",
      image: "./../../assets/img/4.jpg",
    },
    {
      name: "SÓNG GIÓ",
      singer: "K-ICM x JACK",
      path: "./../../assets/music/SÓNG GIÓ - K-ICM x JACK.mp3",
      image: "./../../assets/img/5.jpg",
    },
    {
      name: "Tìm Em Trong Mơ",
      singer: "Chi Dân",
      path: "./../../assets/music/Tìm Em Trong Mơ - Chi Dân.mp3",
      image: "./../../assets/img/6.jpg",
    },
    {
      name: "Lối Nhỏ",
      singer: "Đen ft. Phương Anh Đào",
      path: "./../../assets/music/Đen - Lối Nhỏ ft. Phương Anh Đào (M-V).mp3",
      image: "./../../assets/img/7.jpg",
    },
    {
      name: "Người Sẽ Đi Tìm Em",
      singer: "Ưng Hoàng Phúc",
      path:
        "./../../assets/music/Người Sẽ Đi Tìm Em - Ưng Hoàng Phúc - Vệ Sĩ Bất Đắc Dĩ - Sóng Ngầm 2 - Phim Ngắn Ca Nhạc 2018.mp3",
      image: "./../../assets/img/8.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
          <div
            class="thumb ${
              index === this.currentIndex && "active" ? "Animate" : ""
            }"
            style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`;
    });
    playList.innerHTML = html.join("");
  },

  defineProperties: function () {
    // console.log(this.pastSong);
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    _this = this;
    //Xử lý CD quay và dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        //keyframe
        { transform: "rotate(360deg)" },
      ],
      {
        duration: 10000, //10 giấy
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //CD in playlist
    cdSongThumb = document.querySelector(".Animate").animate(
      [
        //keyframe
        { transform: "rotate(360deg)" },
      ],
      {
        duration: 10000, //10 giấy
        iterations: Infinity,
      }
    );
    cdSongThumb.pause();

    //Xử lý phóng to thu nhỏ CD khi scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWWidth = cdWidth - scrollTop;
      cd.style.width = newCdWWidth > 0 ? newCdWWidth + "px" : 0;
      // cd.style.opacity = newCdWWidth / cdWidth;
    };

    //Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
        clearInterval(updateProgress);
      } else {
        audio.play();
        timeout = setInterval(updateProgress, 500);
      }
    };

    // Khi bài hát được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      //CD Song thumb quay
      if (document.querySelector(".active")) {
        cdSongThumb.play();
      }
    };
    // Khi bài hát được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
      if (document.querySelector(".active")) {
        cdSongThumb.pause();
      }
    };
    //Thanh thời gian
    var updateProgress = function () {
      var currentSec, durationSec;
      currentSec =
        parseInt(audio.currentTime % 60) < 10
          ? "0" + parseInt(audio.currentTime % 60)
          : parseInt(audio.currentTime % 60);
      durationSec =
        parseInt(audio.duration % 60) < 10
          ? "0" + parseInt(audio.duration % 60)
          : parseInt(audio.duration % 60);
      timeLeft.textContent =
        parseInt(audio.currentTime / 60) + ":" + currentSec;
      timeRight.textContent = parseInt(audio.duration / 60) + ":" + durationSec;
    };

    //khi thời gian thay đổi
    audio.ontimeupdate = function () {
      // console.log(_this.isTimeUpdate, "2");

      if (audio.duration && _this.isTimeUpdate) {
        // console.log(_this.isTimeUpdate);
        const progressPercent = Math.round(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    progress.addEventListener("mousedown", function () {
      _this.isTimeUpdate = false;
    });
    progress.addEventListener("touchstart", function () {
      _this.isTimeUpdate = false;
    });
    //Xử lý khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (parseInt(e.target.value) / 100) * audio.duration;
      audio.currentTime = seekTime;
      _this.isTimeUpdate = true;
    };
    // next and prev btn
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.nextSong();

        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      _this.render();
      audio.play();

      cdSongThumb = document.querySelector(".Animate").animate(
        [
          //keyframe
          { transform: "rotate(360deg)" },
        ],
        {
          duration: 10000, //10 giấy
          iterations: Infinity,
        }
      );
      cdSongThumb.play();
      _this.scrollToActiveSong();
      // clearInterval(updateProgress);
      progress.value = 0;
      updateProgress();

      //Lưu giá trị index của song được phát cuối cùng
      // pastSong = _this.currentIndex;
      // _this.setConfig("pastSong", pastSong);
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.prevSong();
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      _this.render();
      audio.play();

      cdSongThumb = document.querySelector(".Animate").animate(
        [
          //keyframe
          { transform: "rotate(360deg)" },
        ],
        {
          duration: 10000, //10 giấy
          iterations: Infinity,
        }
      );
      cdSongThumb.play();
      _this.scrollToActiveSong();
      // clearInterval(updateProgress);
      progress.value = 0;
      updateProgress();
      //Lưu giá trị index của song được phát cuối cùng
      // pastSong = _this.currentIndex;
      // _this.setConfig("pastSong", pastSong);
    };
    //Random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //Xử lý lặp lại một bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //Xử lý next bài hát khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    playList.onclick = (e) => {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        //Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
          cdSongThumb = document.querySelector(".Animate").animate(
            [
              //keyframe
              { transform: "rotate(360deg)" },
            ],
            {
              duration: 10000, //10 giấy
              iterations: Infinity,
            }
          );
          cdSongThumb.play();
          //Lưu giá trị index của song được phát cuối cùng
          // pastSong = _this.currentIndex;
          // _this.setConfig("pastSong", pastSong);
        }

        //Xử lý khi click vào song option
        if (e.target.closest(".option")) {
        }
      }
    };

    //Volume
    volumeBtn.onclick = () => {
      audio.muted = true;
      muteBtn.style.display = "block";
      volumeBtn.style.display = "none";
    };
    muteBtn.onclick = () => {
      audio.muted = false;
      muteBtn.style.display = "none";
      volumeBtn.style.display = "block";
    };
    changeVolumeBtn.onchange = () => {
      console.log(changeVolumeBtn.value);
      audio.volume = changeVolumeBtn.value;
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  // loadStorageSong: function () {
  //   heading.textContent = this.songs[this.config.pastSong].name;
  //   cdThumb.style.backgroundImage = `url('${
  //     this.songs[this.config.pastSong].image
  //   }')`;
  //   audio.src = this.songs[this.config.pastSong].path;

  //   // console.log(heading, cdThumb, audio);
  // },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    // console.log(heading, cdThumb, audio);
  },
  //Load config
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.pastSong = this.config.pastSong;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    if (oldIndex.length == this.songs.length) {
      oldIndex = [];
    } else {
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
      } while (oldIndex.indexOf(newIndex) !== -1);
      // console.log(newIndex, this.currentIndex);
      this.currentIndex = newIndex;
      oldIndex.push(newIndex);
      // console.log(oldIndex, newIndex, oldIndex.length, this.songs.length);
    }
    this.loadCurrentSong();
  },
  start: function () {
    //Gán config vào ứng dụng
    this.loadConfig();

    //render playlist
    this.render();
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //Lắng nghe, xử lý các sự kiện(DOM event)
    this.handleEvents();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //Hiể thị trạng thái ban đầu của btn repeat và random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
