var Game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {preload: preload, create: create, update: update});

function preload() {
   Game.load.image('chicken', 'assets/Chicken.jpeg');

}
var chicken;
var cursors;
function create() {
   chicken = Game.add.sprite(0, 0, 'chicken');
   Game.physics.startSystem(Phaser.Physics.ARCADE);
   Game.physics.enable(chicken, Phaser.Physics.ARCADE);
   Game.physics.arcade.gravity.y = 200;
   chicken.body.collideWorldBounds = true;
   //chicken.scale.setTo(-1, -1);
   cursors = Game.input.keyboard.createCursorKeys();
   
}
function update(){
   chicken.body.velocity.x = 0;
   if(chicken.body.velocity.y < 0)
     chicken.body.velocity.y = 0;
   if(cursors.right.isDown)
     chicken.body.velocity.x = 50;
   if(cursors.left.isDown)
     chicken.body.velocity.x = -50;
   if(cursors.up.isDown){
     chicken.body.velocity.y = -210;
   }
}
