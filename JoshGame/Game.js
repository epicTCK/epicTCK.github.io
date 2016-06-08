var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {preload: preload, create: create, update: update});

function preload() {
   game.load.image('chicken', 'assets/Chicken.jpeg');

}
var chicken;
function create() {
   chicken = game.add.sprite(0, 0, 'chicken');
   Game.physics.startSystem(Phaser.Physics.ARCADE);
   Game.physics.enable(chicken, Phaser.Physics.ARCADE);

}
function update(){
   console.log('hi');
}
