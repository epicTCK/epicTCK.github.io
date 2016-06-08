var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {preload: preload, create: create, update: update});

function preload() {
   game.add.image('chicken', '/assets/chicken.png');

}
var chicken;
function create() {
   chicken = game.add.sprite(0, 0, 'chicken');
}
function update(){
}
