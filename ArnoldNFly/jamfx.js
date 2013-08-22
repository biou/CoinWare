var canvas = CE.defines("canvas_id").
        extend(Animation).
        ready(function() {
            canvas.Scene.call("MainMenu");
        });
		
var tappedFly = false;
var hasWin = false;
var hasLoose = false;

var bzz = document.getElementsByTagName("audio")[0];
var splash;


var map, animation;
var hasLoaded = false;

var game = null;

function endGame() {
		document.getElementsByTagName("audio")[0].pause();
		canvas.Scene._scenes.MainMenu.player.hide();
		//canvas.Scene._scenes.MainMenu.render = function(stage) {stage.refresh();};
		if (hasWin) {
			game.end(true, 1);
		}
		else {
			game.end(false, 0);
		}
	}
		
canvas.Scene.new({
    name: "MainMenu",
    materials: {
        images: {
            "fly": "images/fly.png",
			"flyd": "images/flyd.png",
            "arnold": "images/arnold.jpg",
			"eye": "images/eye.png"
        }
    },
	play: function() {
		this.player.x = Math.floor(Math.random()*(this.getCanvas().width - 64)); // dans le canvas
		this.player.Y = Math.floor(Math.random()*(this.getCanvas().height - 64)); // dans le canvas
		this.player.regX = 32;
		this.player.regY = 32;
		var angle = Math.random() * Math.PI * 2;
		this.player.dirX = Math.cos(angle);
		this.player.dirY = Math.sin(angle);
		this.player.timeBeforeNextMove = Math.random() * 400 + 100; // 100-500ms
		this.player.timeOfLastFrame = new Date().getTime();
		
		animation.play("walk", "loop");
		document.getElementsByTagName("audio")[0].play();
		
		tappedFly = false;
		hasWin = false;
		hasLoose = false;
		
		var myVar = setTimeout(function(){this.endGame()},10000);
		this.player.show();
		if (this.playerd != undefined) {
			this.playerd.hide();
		}
	},
    ready: function(stage) {

        
        this.player = this.createElement();
        this.player.x = Math.floor(Math.random()*(this.getCanvas().width - 64)); // dans le canvas
		this.player.Y = Math.floor(Math.random()*(this.getCanvas().height - 64)); // dans le canvas
		this.player.regX = 32;
		this.player.regY = 32;
		var angle = Math.random() * Math.PI * 2;
		this.player.dirX = Math.cos(angle);
		this.player.dirY = Math.sin(angle);
		this.player.timeBeforeNextMove = Math.random() * 400 + 100; // 100-500ms
		this.player.timeOfLastFrame = new Date().getTime();
	
		
		this.leftEye = this.createElement();
		this.leftEye.x = 210;
		this.leftEye.y = 190;
		this.leftEye.regX = 32;
		this.leftEye.regY = 32;
		this.leftEye.drawImage("eye");
		this.rightEye = this.createElement();
		this.rightEye.x = 340;
		this.rightEye.y = 190;
		this.rightEye.regX = 32;
		this.rightEye.regY = 32;
		this.rightEye.drawImage("eye");
		
        animation = canvas.Animation.new({
            images: "fly",
            animations: {
                walk: {
                    frames: [0, 1],
                    size: {
                        width: 64,
                        height: 64
                    },
                    frequence: 2
                }
            }
        });
        
        
        animation.add(this.player);
        animation.play("walk", "loop");
               
        map = this.createElement();
        map.drawImage("arnold");
		
		map.append(this.leftEye);
		map.append(this.rightEye);
		
        //map.append(this.player);
		
		this.player.on("tap", function(e, mouse) {
            console.log("tap fly!");
			tappedFly = true;
			document.getElementsByTagName("audio")[0].pause();
			document.getElementsByTagName("audio")[1].play();
			//splash.play();
        });
		
		map.on("tap", function(e, mouse) {
            console.log("tap!");
        });
              
        stage.append(map);
		stage.append(this.player);
		
		document.getElementsByTagName("audio")[0].load();
		document.getElementsByTagName("audio")[1].load();
		//splash = canvas.Sound.get("splash");
		//document.getElementsByTagName("audio")[0].play();
        this.hasLoaded = true;
    },
    hasLoaded: false,
	checkIfLoadedHasBeenCalled: false,
	checkIfLoaded: function() {
		return this.hasLoaded;
	},
    render: function(stage) {
        if (tappedFly) {
			this.playerd = this.createElement();
			this.playerd.x = this.player.x;
			this.playerd.y = this.player.y;
			
			this.playerd.regX = 32;
			this.playerd.regY = 32;
			this.playerd.rotation = this.player.rotation;
			this.playerd.drawImage("flyd");
			//stage.remove(this.player);
			stage.append(this.playerd);
			this.player.hide();
			
			
			
			hasWin = true;
			tappedFly = false;
		}
		else if (!hasWin) {
		
			this.player.x += this.player.dirX * 5;
			this.player.y += this.player.dirY * 5;
			
			if (this.player.x + 64 >= this.getCanvas().width || this.player.x < 0) this.player.dirX = -this.player.dirX;
			if (this.player.y + 64 >= this.getCanvas().height || this.player.y < 0) this.player.dirY = -this.player.dirY;
			
			var now = new Date().getTime();
			var timeSinceLastFrame = now - this.player.timeOfLastFrame;
			this.player.timeOfLastFrame = now;
			
			this.player.timeBeforeNextMove -= timeSinceLastFrame;
			if (this.player.timeBeforeNextMove <= 0) {
				var angle = Math.random() * Math.PI * 2;
				this.player.dirX = Math.cos(angle);
				this.player.dirY = Math.sin(angle);
				this.player.rotation = angle * 57.2957795;
				this.player.timeBeforeNextMove = Math.random() * 400 + 100; // 100-500ms
			}
			
			this.leftEye.rotateTo(Math.atan2(this.player.y - this.leftEye.y, this.player.x - this.leftEye.x)* 57.2957795);
			this.rightEye.rotateTo(Math.atan2(this.player.y - this.rightEye.y, this.player.x - this.rightEye.x)* 57.2957795);
			
		}
		
        stage.refresh();
    }
});
