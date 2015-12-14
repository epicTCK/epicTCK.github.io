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
}

var map;
var layer;
var player;
var enemy;
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

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    background = game.add.tileSprite(0, 0, 800, 700, 'cityBackground1');
    jumpSprite = game.add.sprite(400, 0, 'upKey');
    game.physics.arcade.enable(jumpSprite);
    jumpSprite.body.gravity.y = 300;
    background.fixedToCamera = true;

    crateSprite1 = placeCrate(220, 0);
    crateSprite2 = placeCrate(1145, 300);

    pipes = game.add.group();

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
    alertText = game.add.text(40, 0, '', {
        font: "15px Arial",
        fill: "#19de65"
    });
    alertText.fixedToCamera = true;

    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    //enemy = placeEnemy(600, 450);
    player = game.add.sprite(0, 0, 'playerSheet');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 500;
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
    jumpInput = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpInput.onDown.add(jump);
}

var crouch = false;




function update() {
    if (player.body.x > 2300) {
        player.body.gravity.y = 800;
    }
    if (player.body.x < 2300) {
        player.body.gravity.y = 500;
    }
    game.world.bringToTop(alertText);
    game.world.bringToTop(jumpSprite);

    game.world.bringToTop(crouchSprite);
    game.physics.arcade.collide(player, pipes);
    game.physics.arcade.collide(player, layer);

    if (!jumpKey) {
        game.physics.arcade.collide(jumpSprite, layer);
    }
    if (!crouchKey) {
        game.physics.arcade.collide(crouchSprite, layer);
    }

    game.physics.arcade.collide(player, crateSprite1);
    game.physics.arcade.collide(layer, crateSprite1);
    game.physics.arcade.collide(player, crateSprite2);
    game.physics.arcade.collide(layer, crateSprite2);
    // game.physics.arcade.collide(enemy, player);
    // game.physics.arcade.overlap(enemy, player, conflict());

    game.physics.arcade.overlap(jumpSprite, player, jumpAdd);
    game.physics.arcade.overlap(crouchSprite, player, crouchAdd);
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

function input() {
    stand = true;
    pipe1.body.checkCollision.up = true;
    pipe2.body.checkCollision.up = true;
    player.body.velocity.x = 0;
    if (cursorKeys.right.isDown) {
        crouch = false;
        player.body.velocity.x = 200;
        player.animations.play('right');
        stand = false;
        player.scale.x = 1;

    }
    if (cursorKeys.left.isDown) {
        crouch = false;
        player.body.velocity.x = -200;
        player.animations.play('right');
        stand = false;
        player.scale.x = -1;
        stand = false
    }




    if (cursorKeys.down.isDown && crouchKey) {
        stand = false;
        crouch = true
        player.animations.play('crouch');
        pipe1.body.checkCollision.up = false;
        pipe2.body.checkCollision.up = false;

    }
    if (player.body.velocity.y < 0) {
        stand = false;
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
    if ((player.body.touching.down || player.body.velocity.y == 0) && jumpKey) {
        canJump = false;
        crouch = false;
        player.animations.play('jump');
        player.body.velocity.y = -400;



    }
}

function jumpAdd() {
    jumpKey = true;
    jumpSprite.body.x = 0;
    jumpSprite.body.y = 0;
    setTimeout(function () {
        jumpSprite.fixedToCamera = true;
    }, 50);
    alertText.text = "Ability Get: Jump (press up)";

}

function crouchAdd() {
    crouchKey = true;
    crouchSprite.body.x = 0;
    crouchSprite.body.y = 36;
    setTimeout(function () {
        crouchSprite.fixedToCamera = true;
    }, 50);
    alertText.text = "Ability Get: crouch (press down) \nWhen crouched you can fall through pipes";

}