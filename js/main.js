'use strict'

// INITIALIZE
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameArea', null);
var scaleRatio = window.devicePixelRatio / 8;

// SETTINGS
var mainState = {
    preload: function(){
        // BACKGROUND
        game.load.image('background', 'assets/flappyBg.png');
        // BIRD IMAGE
        game.load.image('bird', 'assets/flappy.png');
        // PIPE IMAGE
        game.load.image('pipe', 'assets/pipe.png');
        // JUMP AUDIO
        game.load.audio('jump', 'assets/jump.wav');
    },
    create: function(){
        // GAME SETTINGS
        game.stage.backgroundColor = '#71c5cf';
        game.add.tileSprite(0, window.innerHeight - 600, window.innerWidth, 600, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // BIRD SETTINS
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.body.setSize(300, 300, 25, 10);
        // PIPE SETTINS
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(2500, this.addRowOfPipes, this);
        // SCORE SETTINGS
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        // JUMP SETTINGS
        this.jumpSound = game.add.audio('jump');

        // SPACE KEY -- JUMP
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },
    update: function(){
        // SCALE
        this.bird.scale.setTo(scaleRatio);
        // BIRD DIED -- OF THE SCREEN
        if (this.bird.y < -80 || this.bird.y > window.innerHeight) {
            this.restartGame();
        }
        // BIRD ANIMATION
        this.bird.anchor.setTo(-0.2, 0.5);
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }
        // COLLISION
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },
    jump: function(){
        // STOP MOVING BIRD WHEN DEAD
        if (this.bird.alive == false) {
            return;
        }
        this.bird.body.velocity.y = -350;
        // BIRD JUMP ANIMATION & SOUND
        this.jumpSound.play();
        var animation = game.add.tween(this.bird);
        animation.to({angle: -10}, 100).start();
    },
    addOnePipe: function(x, y){
        // CREATE PIPE AT X,Y
        var pipe = game.add.sprite(x, y, 'pipe');
        // ADD PIPE TO GROUP
        this.pipes.add(pipe);
        // PIPE PHYSICS
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;
        // DESTROY PIPE IF OUT OF SCREEN
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function(){
        // GET HOLE IN PIPES
        var hole = Math.floor(Math.random() * 13) + 1;
        // ADDING PIPES TO ROW
        for (var i = 0; i < 19; i++){
            if (this.score < 20 && this.score > 0){
                if (i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3 && i != hole + 4) {
                    this.addOnePipe(window.innerWidth, i * 45 - 5);
                }
            } else if (this.score > 20 && this.score < 50) {
                if (i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3) {
                    this.addOnePipe(window.innerWidth, i * 45 - 5);
                }
            } else if (this.score > 50) {
                if (i != hole && i != hole + 1 && i != hole + 2) {
                    this.addOnePipe(window.innerWidth, i * 45 - 5);
                }
            }
        }
        // ADD SCORE
        this.score += 1;
        this.labelScore.text = this.score;
    },
    hitPipe: function(){
        game.stage.backgroundColor = '#992d2d';
        
        if (this.bird.alive == false) {
            return;
        }
        this.bird.alive = false;
        // STOP PIPES ADDING
        game.time.events.remove(this.timer);
        // STOP PIPES MOVING
        this.pipes.forEach(function(pipe){
            pipe.body.velocity = 0;
        }, this);
    },
    restartGame: function(){
        this.state.start('main');
    }
};

// ADD MAIN STATE
game.state.add('main', mainState);

// START STATE -- THE GAME
game.state.start('main');