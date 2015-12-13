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
}

var map;
var layer;
var player;
var enemy;
var overLap = false;
var cursorKeys;
var punchKey = false;
var jumpKey = true;
var crouchKey = false;
var background;
var jumpkey;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    background = game.add.tileSprite(0, 0, 800, 700, 'cityBackground1');

    background.fixedToCamera = true;


    map = game.add.tilemap('tileMap');
    map.addTilesetImage('megacommando1');


    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    //enemy = placeEnemy(600, 450);
    player = game.add.sprite(0, 0, 'playerSheet');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('stand', [0], 5, true);
    player.animations.add('jump', [8], 5, true);
    player.animations.add('crouch', [5, 6], 5, false);
    player.animations.add('right', [1, 2, 3, 4], 3, true);
    player.animations.add('punch', [9], 5, true);
    map.setCollisionBetween(0, 5119);
    cursorKeys = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
    player.anchor.setTo(.5, 1);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpKey.onDown.add(jump);
}

var crouch = false;



function update() {
    game.physics.arcade.collide(player, layer);
    // game.physics.arcade.collide(enemy, player);
    // game.physics.arcade.overlap(enemy, player, conflict());
    //ai();
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
    return enemy1;
}
*/
/*
 *Input and Animation
 *Called by update() game loop
 */
var stand;

function input() {
    stand = true;

    player.body.velocity.x = 0;
    if (cursorKeys.right.isDown) {
        crouch = false;
        player.body.velocity.x = 100;
        player.animations.play('right');
        stand = false;
        player.scale.x = 1;

    }
    if (cursorKeys.left.isDown) {
        crouch = false;
        player.body.velocity.x = -150;
        player.animations.play('right');
        stand = false;
        player.scale.x = -1;
        stand = false
    }




    if (cursorKeys.down.isDown && crouchKey) {
        stand = false;
        crouch = true
        player.animations.play('crouch');


    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && punchKey) {
        player.animations.play('punch');
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
    enemy.body.velocity.x = 0;
    if (Math.abs(player.body.x - enemy.body.x) < 500 && !overLap) {
        if (player.body.x < enemy.body.x) {
            enemy.body.velocity.x = -75;
            enemy.animations.play('right');
        } else {
            enemy.body.velocity.x = 75;
        }
    }

}
*/
var timeStamp;
var oldTimeStamp = new Date();
/*
function conflict(whichEnemy) {
    timeStamp = new Date();
   overLap = true;
    if (timeStamp.getTime() - oldTimeStamp.getTime > 100) {

        enemy.animations.play('punch');
        oldTimeStamp = timeStamp;
  

        //enemy.animations.play('stand');
    }
}
*/
function jump() {
    if (player.body.velocity.y == 0) {
        crouch = false;
        player.animations.play('jump');
        player.body.velocity.y = -300;
        /*
        setTimeout(function () {
            player.body.velocity.y = 300;
        }, 300);
        */
        stand = false;

        console.log("it works");
    }
}