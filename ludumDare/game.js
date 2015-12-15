var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

// art by surt:
//http://opengameart.org/content/more-nes-like-tiles

function preload() {
    game.load.tilemap('tileMap', 'assets/tileMap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('playerSheet', 'assets/playerSheet.png', 60, 111);
    game.load.spritesheet('enemySheet', 'assets/enemySheet.png', 64, 106);
    game.load.image('megacommando1', 'assets/megacommando.png');
    game.load.image('cityBackground1', 'assets/cityBackground1.png');
    game.load.image('upKey', 'assets/upKey.png');
    game.load.image('crate', 'assets/crate.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.image('downKey', 'assets/downKey.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('gameOver', 'assets/gameOver.png');
    game.load.audio('cheerUp', 'http://opengameart.org/sites/default/files/Cheer%20up%20PSG%208-bit%20Loop_v2_0.mp3');
}

var map;
var layer;
var player;
var onPipe = false;
var overLap = false;
var cursorKeys;
var punchKey = true;
var jumpKey = false;
var crouchKey = false;
var background;
var jumpInput;
var jumpSprite;
var crouchSprite;
var crateSprite1;
var crateSprite2;
var debugText;
var canJump = false;
var pipe1;
var pipe2;
var alertText;
var pipes;
var crateSprite3;
var crateSprite4;
var pipe3;
var crates;
var pushKey = true;
var enemyDefeat = false;
var music;
var gameOver;

function create() {
    music = game.add.audio('cheerUp');
    music.loopFull();
    game.physics.startSystem(Phaser.Physics.ARCADE);

    background = game.add.tileSprite(0, 0, 800, 700, 'cityBackground1');
    jumpSprite = game.add.sprite(400, 215, 'upKey');
    game.physics.arcade.enable(jumpSprite);
    jumpSprite.body.gravity.y = 300;
    background.fixedToCamera = true;

    crateSprite1 = placeCrate(220, 200);
    crateSprite2 = placeCrate(1145, 300);
    crateSprite3 = placeCrate(1990, 385);
    crateSprite4 = placeCrate(2289, 240);
    pipes = game.add.group();
    crates = game.add.group();
    crates.add(crateSprite1);
    crates.add(crateSprite2);
    crates.add(crateSprite3);
    crates.add(crateSprite4);
    pipe2 = game.add.sprite(1700, 350, 'pipe');
    pipe1 = game.add.sprite(1700, 500, 'pipe');


    pipes.add(pipe1);
    pipes.add(pipe2);

    game.physics.enable(pipe1);
    game.physics.enable(pipe2);


    pipe1.body.immovable = true;
    pipe2.body.immovable = true;



    crouchSprite = game.add.sprite(1330, 433, 'downKey');
    game.physics.enable(crouchSprite);
    crouchSprite.body.gravity.y = 300;
    crouchSprite.body.collideWorldBounds = true;

    map = game.add.tilemap('tileMap');
    map.addTilesetImage('megacommando1');
    alertText = game.add.text(40, 0, 'You lost your face. You must retrieve it.\nMove using arrow keys', {
        font: "15px Arial",
        fill: "#19de65"
    });
    alertText.fixedToCamera = true;

    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    player = game.add.sprite(50, 0, 'playerSheet');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;
    player.health = 7;
    player.body.collideWorldBounds = true;
    //player.body.bounce.y = 0.4;
    jumpSprite.body.collideWorldBounds = true;
    player.animations.add('stand', [0], 5, true);
    player.animations.add('jump', [8], 5, true);
    player.animations.add('crouch', [6], 5, false);
    player.animations.add('right', [1, 2, 3, 4], 3, true);
    player.animations.add('punch', [9], 5, true);
    map.setCollisionBetween(0, 5119);
    cursorKeys = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    player.anchor.setTo(.5, 1);

}

var crouch = false;




var win = false;

function update() {
    if (player.body.x > 3000) {
        gameOver = game.add.tileSprite(0, 0, 800, 600, 'gameOver');
        win = true;
        gameOver.fixedToCamera = true;
    }
    if (win) {
        game.world.bringToTop(gameOver);
    }
    crateSprite4.body.velocity.x = 0;
    crateSprite3.body.velocity.x = 0;
    overLap = false;


    game.world.bringToTop(alertText);
    game.world.bringToTop(jumpSprite);

    game.world.bringToTop(crouchSprite);
    /*
     *Collision Detection
     *
     *
     */

    game.physics.arcade.collide(player, pipes, pipeCollide);
    game.physics.arcade.collide(player, layer, pipeUnCollide);

    if (!jumpKey) {
        game.physics.arcade.collide(jumpSprite, layer);
    }
    if (!crouchKey) {
        game.physics.arcade.collide(crouchSprite, layer);
    }
    if (pushKey) {
        game.physics.arcade.collide(player, crates);
    }
    game.physics.arcade.collide(layer, crates);
    game.physics.arcade.collide(crates);


    // game.physics.arcade.collide(enemy, player);


    game.physics.arcade.overlap(jumpSprite, player, jumpAdd);
    game.physics.arcade.overlap(crouchSprite, player, crouchAdd);

    input();

}
/*
function placeEnemy(x, y) {
    var enemy1 = game.add.sprite(x, y, 'enemySheet');
    game.physics.arcade.enable(enemy1);
    enemy1.body.gravity.y = 500;
    enemy1.body.collideWorldBounds = true;
    enemy1.animations.add('stand', [0], 5, true);
    //player.animations.add('jump', [8], 5, true);
    //player.animations.add('crouch', [5, 6], 5, false);
    enemy1.animations.add('right', [1, 2, 3, 4, 5, 6], 5, true);
    enemy1.animations.add('punch', [25, 26], 2, true);
    enemy1.anchor.setTo(.5, 1);
    enemy1.health = 100;
    return enemy1;
}
*/

var crateSprite;

function placeCrate(x, y) {
    crateSprite = game.add.sprite(x, y, 'crate');
    game.physics.enable(crateSprite);
    crateSprite.body.gravity.y = 300;

    crateSprite.body.collideWorldBounds = true;
    return crateSprite;
}
/*
 *Input and Animation
 *Called by update() game loop
 */
var stand;
var toggle = false;

function input() {
    stand = true;

    pipe1.body.checkCollision.up = true;
    pipe2.body.checkCollision.up = true;

    player.body.velocity.x = 0;

    if (cursorKeys.left.isDown && cursorKeys.right.isDown) {
        if ((player.body.touching.down || player.body.velocity.y == 0) && jumpKey && !onPipe) {

            crouch = false;
            stand = false;
            player.animations.play('jump');
            player.body.velocity.y = -400;
            if (player.scale.x == 1) {
                player.body.velocity.x = 300;
            } else {
                player.body.velocity.x = -300;
            }
        }
    }

    if (cursorKeys.left.isDown && cursorKeys.right.isDown && onPipe) {

        stand = false;
        crouch = true;
        player.animations.play('crouch');
        pipe1.body.checkCollision.up = false;
        pipe2.body.checkCollision.up = false;


    }


    if (cursorKeys.right.isDown && !cursorKeys.left.isDown) {

        player.animations.play('right');


        crouch = false;
        player.body.velocity.x = 200;
        stand = false;
        player.scale.x = 1;

    }

    if (cursorKeys.left.isDown && !cursorKeys.right.isDown) {
        crouch = false;
        player.body.velocity.x = -200;
        player.animations.play('right');
        stand = false;
        player.scale.x = -1;
        stand = false
        right = false;

    }

    //push animation uses punch 
    if (crateSprite3.body.velocity.x > 0 ||
        crateSprite4.body.velocity.x > 0 ||
        crateSprite2.body.velocity.x > 0 ||
        crateSprite1.body.velocity.x > 0) {
        player.animations.play('punch');
        stand = false;
        crouch = false;


    }





    if (player.body.velocity.y < 0) {
        stand = false;
    }


    if (stand) {
        player.animations.play('stand');
    }
}
/*
 *Artificial Inteligence for the enemy
 *Called by update() game loop
 *TODO: AI needs work in the punching stuff area lol
 */
/*
function ai() {
    if (!enemyDefeat) {
        enemy.body.velocity.x = 0;
        if (Math.abs(player.body.x - enemy.body.x) < 500 && !overLap) {
            if (player.body.x < enemy.body.x) {

                enemy.body.velocity.x = -75;
                enemy.animations.play('right');
                enemy.scale.x = -1;
            } else {
                enemy.scale.x = 1;
                enemy.body.velocity.x = 75;
            }
        }
    }
}

var timeStamp;
var oldTimeStamp = new Date();

function conflict(whichEnemy) {
    timeStamp = new Date();
    overLap = true;
    if (timeStamp.getTime() - oldTimeStamp.getTime() > 100) {
        player.health -= 1;
        enemy.animations.play('punch');
        if (enemy.body.x < player.body.x) {
            player.body.velocity.x += 20;
        } else {
            player.body.velocity.x -= 20;
        }
        oldTimeStamp = timeStamp;
        enemy.body.velocity.x = 0;

        // enemy.animations.play('stand');
    }
}
*/


function jumpAdd() {
    jumpKey = true;
    jumpSprite.body.x = 0;
    jumpSprite.body.y = 0;
    setTimeout(function () {
        jumpSprite.fixedToCamera = true;
    }, 50);
    alertText.text = "Ability Get: Jump (press both arrow keys)";

}

function crouchAdd() {
    crouchKey = true;
    crouchSprite.body.x = 0;
    crouchSprite.body.y = 36;
    setTimeout(function () {
        crouchSprite.fixedToCamera = true;
    }, 50);
    alertText.text = "Ability Get: crouch (press both arrow keys when on a pipe) \nWhen crouched you can fall through pipes";

}

function devCheatMode() {
    crouchAdd();
    jumpAdd();

}

function pipeCollide() {
    onPipe = true;
}

function pipeUnCollide() {
    onPipe = false;
}
