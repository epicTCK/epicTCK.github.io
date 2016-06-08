var Game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {preload: preload, create: create, update: update});

function preload() {
   Game.load.image('chicken', 'assets/Chicken.jpeg');

}
var chicken;
function create() {
   chicken = Game.add.sprite(0, 0, 'chicken');
   Game.physics.startSystem(Phaser.Physics.ARCADE);
   Game.physics.enable(chicken, Phaser.Physics.ARCADE);
   Game.physics.arcade.gravity.y = 200;
   Chicken.body.collideWorldBounds = true;
}
function update(){
   console.log('hi');
}
