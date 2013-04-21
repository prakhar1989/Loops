var Songs = {
    init: function( config ) {
        this.songs;
        this.currentSongIndex = -1;
        this.isPaused = true;
        this.playlistTemplate = config.playlistTemplate;
        this.sidebar = config.sidebar;
        this.container = config.container;
        this.playlist = config.playlist;
        this.songsFolder = config.songsFolder;
        this.songClassName = config.songClassName;
        this.audio = config.audio;
        this.controls = config.controls;
        this.mainTemplate = config.mainTemplate;
        this.api_key = config.api_key;
        this.fetchSongs();
        this.declarations();
        this.colorBGImage(false);
        this.keyboardBindings();
        this.preloadImages();
    },

    preloadImages: function() {
        var arr = ["/static/img/bg/dark.jpg", "/static/img/bg/light.jpg"];
        $.each(arr, function(index, img){
            $(new Image())[0].src = img;
        });
    },

    colorBGImage: function(color) {
        if ( !color ) {
            $(this.container).css('background-image', 'url(/static/img/bg/dark.jpg)'); 
        } else {
            $(this.container).css('background-image', 'url(/static/img/bg/light.jpg)');
        }
    },

    declarations: function() {
        var self = Songs;
        Handlebars.registerHelper('makeFileName', function(){
            return self.songsFolder + this.filename;
        });

        Handlebars.registerHelper('getAlbumArt', function(){
            var img = this.album.image[2]['#text'];
            return img;
        });
    },

    fetchSongs: function(){
       var self = Songs;
       $.getJSON("/songs.json", function(results) {
           self.songs = results.songs;
           self.renderSongs();
           self.bindEvents();
       });
    },

    renderSongs: function() {
        var template = Handlebars.compile(this.playlistTemplate.html());
        this.sidebar.append(template(this.songs));
    },

    playSong: function(songIndex){
        var self = Songs;
        var currentSong = self.songs[songIndex];

        self.currentSongIndex = songIndex; 

        // set audio properties
        self.audio.src = currentSong.filename;
        self.isPaused = false;
        self.audio.play();
        
        $(self.sidebar).find('.pause').removeClass('play');

        self.colorBGImage(true);
        self.fetchInfo(currentSong.title, currentSong.artist);
        self.highlightCurrentSong();
    },

    highlightCurrentSong: function(){
        var self = Songs;
        $(self.sidebar).find(self.songClassName).removeClass('nowplaying');
        var song = $(self.sidebar).find(self.songClassName)[self.currentSongIndex];
        $(song).addClass('nowplaying');
    },

    pauseSong: function() {
        var self = Songs,
            pauseBtn = $(self.sidebar).find('.pause');

        if (!self.isPaused) {
            // playing
            self.audio.pause();
            $(pauseBtn).addClass('play');
        } else {
            // paused
            self.audio.play();
            $(pauseBtn).removeClass('play');
        };

        self.colorBGImage(self.isPaused);
        self.isPaused = !self.isPaused;
    },

    playNextSong: function() {
        this.currentSongIndex = (this.currentSongIndex + 1) % 
                                this.songs.length;
        this.playSong(this.currentSongIndex);
    },

    playPrevSong: function() {
        this.currentSongIndex--;
        if (this.currentSongIndex < 0){
            this.currentSongIndex = this.songs.length - 1;
        }
        this.playSong(this.currentSongIndex);
    },

    bindEvents: function() {
        var self = Songs;
        var pauseBtn = self.controls.find('.pause');

        $(self.sidebar).find(self.songClassName).on('click', function(){
            self.playSong($(this).data('index'));
        });
        
        $(pauseBtn).on('click', function(){
            self.pauseSong();
        });

        $(self.sidebar).find('.prev').on('click', function(){
            self.playPrevSong();
        });

        $(self.sidebar).find('.next').on('click', function(){
            self.playNextSong();
        });

        $(self.audio).on('ended', function(){
            self.playNextSong();
        });
    },
    
    fetchInfo: function(title, artist){
        var self = this;
        var url = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" +
                  this.api_key + "&artist=" + artist + "&track=" + title + "&format=json";
        var artist_url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
                         artist + "&api_key=" + this.api_key + "&format=json";
        
        var trackInfo;
        $.getJSON(url, function(results){
            trackInfo = results;
            $.getJSON(artist_url, function(data){
                trackInfo.track.bio = data.artist.bio;
                self.renderInfo(trackInfo);
            });
        });
    },

    renderInfo: function(tracksInfo) {
        var track = tracksInfo.track;
        var template = Handlebars.compile(this.mainTemplate.html());
        this.container.html(template(track));
    },

    keyboardBindings: function() {
        var self = Songs;
        Mousetrap.bind('space', function() {
            if (self.currentSongIndex < 0 ) {
                self.playNextSong();
            } else {
                self.pauseSong();
            }
        });
        Mousetrap.bind('n', function() {
            self.playNextSong();
        });
        Mousetrap.bind('p', function() {
            self.playPrevSong()
        });
    }
};

(function(){
    Songs.init({ 
        playlistTemplate: $('#playlist_template'),
        mainTemplate: $('#main_template'),
        sidebar: $('#sidebar'),
        container: $('#main'),
        songsFolder: '/static/songs/',
        songClassName: '.song',
        audio: $('#loopplayer')[0],
        controls: $('.buttons'),
        api_key: '3874c10e21f44bf92c4e4bfafe429c15' // TODO: remove before pushing on github
    });
})();
