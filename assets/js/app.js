/*
    1: render songs => ok
    2: scroll top => ok
    3: play/pause/seek => ok
    4: cd rotate => ok
    5: next / prev => ok
    6: random => ok
    7: next / repeat when ended => ok
    8: active song => ok
    9: scroll active song into view => ok
    10: play song when click => ok
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MP3_PLAYER'

const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

let checkIndex = [0];

const app = {
    // lấy ra chỉ mục (bài hát) đầu tiên của mảng
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [{
            name: "Bước Qua Nhau",
            singer: "Vũ",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1024/BuocQuaNhau-Vu-7120388.mp3?st=I9W59X1Odyi9QRGTehWfHg&e=1638708688",
            image: "https://avatar-nct.nixcdn.com/song/2021/11/19/6/d/9/1/1637317177185.jpg"
        },
        {
            name: "Ái Nộ",
            singer: "Masew, Khôi Vũ",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1021/AiNo1-MasewKhoiVu-7078913.mp3?st=ngcoKLRyRorVu8KqUeS1wg&e=1638762705",
            image: "https://avatar-nct.nixcdn.com/song/2021/08/30/2/1/a/e/1630316309035.jpg"
        },
        {
            name: "Muộn Rồi Mà Sao Còn",
            singer: "Sơn Tùng M-TP",
            path: "https://c1-ex-swe.nixcdn.com/Believe_Audio19/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3?st=tD-Ln6qGqkdH659AeuHsjQ&e=1638782546",
            image: "https://avatar-nct.nixcdn.com/song/2021/04/29/9/1/f/8/1619691182261.jpg"
        },
        {
            name: "Thức Giấc",
            singer: "Da LAB",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1018/ThucGiac-DaLAB-7048212.mp3?st=1LcQhTisk8WrOQuzK4p86Q&e=1638782708",
            image: "https://avatar-nct.nixcdn.com/song/2021/07/14/8/c/f/9/1626231010810.jpg"
        },
        {
            name: "Độ Tộc 2",
            singer: "Masew, Độ Mixi, Phúc Du, Pháo",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1020/DoToc2-MasewDoMixiPhucDuPhao-7064730.mp3?st=ehahZN3-iX9xYdBFgDgGcg&e=1638782785",
            image: "https://avatar-nct.nixcdn.com/song/2021/08/10/b/2/e/0/1628579601228.jpg"
        },
        {
            name: "Chúng Ta Sau Này",
            singer: "T.R.I",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1010/ChungTaSauNay-TRI-6929586.mp3?st=l56Wr1fLE9fMnFehhpo5xg&e=1638782875",
            image: "https://avatar-nct.nixcdn.com/song/2021/01/27/5/2/2/b/1611738358661.jpg"
        },
        {
            name: "Dịu Dàng Em Đến",
            singer: "ERIK, NinjaZ",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1021/DiuDangEmDen-ERIKNinjaZ-7078877.mp3?st=QmjyqbnGv3jClPKm4oA1YQ&e=1638782938",
            image: "https://avatar-nct.nixcdn.com/song/2021/08/30/2/1/a/e/1630307726211.jpg"
        },
        {
            name: "Hương",
            singer: "Văn Mai Hương, Negav",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1010/Huong-VanMaiHuongNegav-6927340.mp3?st=PvHOWlRnF6TymvggYGding&e=1638783027",
            image: "https://avatar-nct.nixcdn.com/song/2021/01/22/9/f/2/1/1611280898757.jpg"
        },
        {
            name: "Miên Man",
            singer: "DUTZUX",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1024/MienMan-DUTZUX-7120884.mp3?st=yTOFq5aH8FGEvbm-_n_KTA&e=1638783090",
            image: "https://avatar-nct.nixcdn.com/song/2021/11/19/6/d/9/1/1637320885751.jpg"
        },
        {
            name: "có hẹn với thanh xuân",
            singer: "MONSTAR",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1020/cohenvoithanhxuan-MONSTAR-7050201.mp3?st=PjrrnZ2dZ3ffA6R7dRrppQ&e=1638783161",
            image: "https://avatar-nct.nixcdn.com/song/2021/07/16/f/4/9/8/1626425507034.jpg"
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        // duyệt và lấy ra tất cả các thông tin bài hát, render giao diện
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            // lấy ra bài hát hiện tại
            get: function() {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEnvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý CD thumbnail quay / dừng
        const cdThubAnimate = cdThumb.animate(
            [{
                transform: "rotate(360deg)",
            }, ], {
                duration: 10000, // quay trong 10s
                iterations: Infinity, // vòng quay lặp vô hạn
            }
        );
        cdThubAnimate.pause();

        // xử lý phóng to / thu nhỏ CD thumbnail
        document.onscroll = function() {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // khi bài hát chạy
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThubAnimate.play();
        };

        // khi bài hát dừng
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThubAnimate.pause();
        };

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
                progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' +
                    progressPercent +
                    '%, #d3d3d3 ' +
                    progressPercent +
                    '%, #d3d3d3 100%)';
            }
        };

        // xử lý tua bài hát
        progress.oninput = function(e) {
            audio.pause();
            setTimeout(() => {
                audio.play();
            }, 400);
            // lấy ra thời gian sau khi click tua
            const seekTime = e.target.value * (audio.duration / 100);
            audio.currentTime = seekTime;
        };

        // khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            }
            _this.nextSong();
            _this.activeSong();
            _this.scrollToActiveSong();
            audio.play();
        };

        // khi prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong();
            }
            _this.prevSong();
            _this.activeSong();
            _this.scrollToActiveSong();
            audio.play();

        };

        // random bài hát
        randomBtn.onclick = function() {
            if (_this.isRepeat) {
                _this.isRepeat = !_this.isRepeat;
                // đổi màu button repeat
                repeatBtn.classList.toggle("active", _this.isRepeat);
                _this.setConfig("isRepeat", _this.isRepeat);
            }
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // repeat bài hát
        repeatBtn.onclick = function() {
            if (_this.isRandom) {
                _this.isRandom = !_this.isRandom;
                // đổi màu button random
                randomBtn.classList.toggle("active", _this.isRandom);
                _this.setConfig("isRandom", _this.isRandom);
            }
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // khi bài hát kết thúc
        audio.onended = function() {
            if (_this.isRandom) {
                _this.randomSong();
                audio.play();
            } else if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.onclick();
            }
        };

        // chọn bài hát
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");
            const optionNode = e.target.closest(".option");

            if (songNode || !optionNode) {
                // xử lý khi click vào bài hát
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.activeSong();
                    audio.play();
                }

                // xử lý khi click vào option
                if (optionNode) {}
            }


        };
    },

    activeSong: function() {
        let loopSong = $$(".song");
        for (song of loopSong) {
            song.classList.remove("active");
        }
        const activeSong = loopSong[this.currentIndex];
        activeSong.classList.add("active")
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (checkIndex.includes(newIndex) && checkIndex.length < this.songs.length);
        if (checkIndex.length < this.songs.length) {
            checkIndex.push(newIndex);
        } else {
            checkIndex = [this.currentIndex, newIndex];
        }
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.activeSong();
        this.scrollToActiveSong();
    },

    scrollToActiveSong: function() {
        if (this.currentIndex === 0) {
            document.documentElement.scrollTop = 0;
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300);
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    start: function() {

        // định nghĩa các thuộc tính cho object
        this.defineProperties();

        // lắng nghe và xử lí các sự kiện
        this.handleEnvents();

        // tải thông tin bài hát vào UI khi chạy app
        this.loadCurrentSong();

        // render playlist
        this.render();

        // gán cấu hình từ config vào app
        this.loadConfig();
        // hiển thị trạng thái ban đầu của button repeat và radom
        repeatBtn.classList.toggle("active", this.isRepeat || false);
        randomBtn.classList.toggle("active", this.isRandom || false);
    },
};

app.start();