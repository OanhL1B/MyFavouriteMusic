/**
 * Rander songs
 * Scroll top
 * Play /pause/seek
 * CD rotate
 * Next /prev
 * Random
 * Next / repeat when ended
 * Active song
 * Scroll active song into view
 * play song when click
 */

        const $ = document.querySelector.bind(document);
        const $$ = document.querySelector.bind(document);

        const PLAYER_STORAGE_KEY  = 'HONGOANH_PLAYER';
        const player = $('.player');
        const cd = $('.cd');
        const heading = $('header h2');
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');
        const btnPlay = $('.btn-toggle-play');
        const progress = $('#progress');
        const btnNext = $('.btn-next');
        const btnPrev = $('.btn-prev');
        const randomBtn = $('.btn-random');
        const repeatBtn = $('.btn-repeat');
        const playlist = $('.playlist')
       
      

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [

        {
            name: 'Bầu Trời Đầy Sao Cũng Không Bằng Anh',
            singer: 'Ycccc',
            path: './assets/songs/Bau-Troi-Day-Sao-Khong-Bang-Anh-ycccc.mp3',
            image: './assets/images/yccccc.jpg'
        },
        {
            name: 'The Only One',
            singer: 'SoYou',
            path: './assets/songs/The-Only-One-Soyou.mp3',
            image: './assets/images/18again.jpg'
        },
        {
            name: 'The River',
            singer: 'Alan Walker',
            path: './assets/songs/The-River-Axel-Johansson.mp3',
            image: './assets/images/Alan.jfif'
        },
        
        {
            name: 'Vây Giữ',
            singer: 'Vương Tĩnh Văn',
            path: './assets/songs/Vay-Giu-Vuong-Tinh-Van-Khong-Map.mp3',
            image: './assets/images/1632909428417_640.jpg'
        },
        {
            name: 'Ngốc',
            singer: 'Hương Tràm',
            path: './assets/songs/Ngoc-Huong-Tram.mp3',
            image: './assets/images/HuongTram.jpg'
        },
        {
            name: 'Sài Gòn Hôm Nay Mưa',
            singer: 'Hoàng Duyên',
            path: './assets/songs/Sai-Gon-Hom-Nay-Mua-Orinn-EDM-Remix-JSOL-Hoang-Duyen.mp3',
            image: './assets/images/HoangDuyen.jpg'
        }
    ],
    setConfig : function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
    
        const htmls = this.songs.map((song, index)=>{
            return `
            <div class="song ${index ===this.currentIndex ? 'active': ''}" data-index ="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        // rander cho nó hiện lên list bài hát kéo lên kéo xuống được
       playlist.innerHTML = htmls.join('');
    },

    definePropeties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    
    // EVENTS
    handerEvents : function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý cd quay / dừng
       const cdThumbAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)' }
        ], {
            duration : 10000,
            iterations: Infinity 
        })

        cdThumbAnimate.pause();
        // lắng nghe sự kiện khi mình kéo chuột lên xuống, phóng to thu nhỏ cái cd 
        document.onscroll = function(){
            // biến này là biến lấy tọa độ theo chiều dài trục y khi chúng ta kéo trên trình duyệt
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            // set lại chiều dài cd, nếu kéo nhanh quá thì nó trả về giá trị <0 nên phải set lại giá trị cho nó bằng 0
            cd.style.width = newCdWidth>0 ? newCdWidth + 'px': 0; 
            // làm cho nó mờ dần đi nữa
            cd.style.opacity = newCdWidth / cdWidth; 

        }

        // xử lý khi click vào  play
        btnPlay.onclick =function(){
            if(_this.isPlaying){

                audio.pause()

            }else{

                audio.play();
            }
        }

            // khi được play 
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            // khi pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing')
                cdThumbAnimate.pause();

            }
           
            // khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime/audio.duration *100)
                    progress.value = progressPercent;
                }
               
            }
        
            // xử lý khi tua song

            progress.onchange = function(e){
               const seekTime = audio.duration / 100 * e.target.value
               audio.currentTime = seekTime
            }
             // khi next song
            btnNext.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                }else{
                    _this.nextSong()
                }
                audio.play()
                _this.render();  
                _this.scrollToActiveSong()
            }
            // khi prev song
            btnPrev.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                }else{
                    _this.prevSong()
                }
                 
                audio.play()
                _this.render();  
                _this.scrollToActiveSong()
            }

            // xử lý bật tắt random song
            randomBtn.onclick = function(e){
               _this.isRandom = !_this.isRandom
               _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active',_this.isRandom)
                _this.playRandomSong();
            }
            // xử lý khi bấm repeat song
            repeatBtn.onclick = function(e){
                _this.isRepeat = !_this.isRepeat
               _this.setConfig('isRepeat', _this.isRepeat)

                repeatBtn.classList.toggle('active',_this.isRepeat)
            }
            // xử lý  next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play();
                }else{

                    btnNext.click();
                }
            }
            // kĩ thuật nâng cao hay nên học
            // closetst trả 1 là chính nó hai là cái thẻ cha chứa nó
            // hàng vi lắng nghe khi bấm vào playlist
            playlist.onclick = function(e){ // e là event chúng ta nhận được ở đây, target là cái đích mà chúng ta target nó vào,
                // trả về chính cái mà chúng ta target vào
                const songNode = e.target.closest('.song:not(.active)')

                if(songNode || e.target.closest('.option')){
                // xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    

                }

                // xử lý khi click vào  song option

                if( e.target.closest('.option')){

                }
                }
                

            }

    },

   
    scrollToActiveSong : function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300);
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    loadCurrentSong: function(){
        heading.textContent  = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;

    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()  * this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    // mọi thứ nó sẽ làm trong cái start này 
    start: function(){
        // gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.definePropeties();
        // lắng nghe / xử lý các sự kiện(DOM EVENTS)
        this.handerEvents();
        // tải thông tin bài hát đầu tiên vào user interface(UI) khi chạy ứng dụng
        this.loadCurrentSong();
        // render playlist, lấy ra danh sách bài hát
        this.render();
        // hiện thị trạng thái ban đầu
        randomBtn.classList.toggle('active',_this.isRandom)
        repeatBtn.classList.toggle('active',_this.isRepeat)


    }
    
}
    app.start();