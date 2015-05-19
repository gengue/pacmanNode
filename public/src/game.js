var players = [];
var socket = io.connect('http://localhost:8000');
var UiPlayers = document.getElementById('players');


var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();
 
Q.gravityY = 0;
 
var objectFiles = [
  './src/player'
];
 
require(objectFiles, function () {

  function setUp(stage){// when a user connected render the span
    socket.on('count', function(data){
      UiPlayers.innerHTML = 'Players: ' + data['players'];
    });
    
    socket.on('connected', function(data){// when 'connected', the user recive the id in data, and instance a new player with quintus
      selfId = data['playerId'];
      player = new Q.Player({ playerId: selfId, x: 100, y: 100, socket: socket });
      stage.insert(player);
      stage.add('viewport').follow(player);
    });

    socket.on('updated', function(data){
      var actor = platers.filter(function(obj){
        return obj.playerId==data['playerId'];
      })[0];
      if (actor) {
        actor.player.p.x = data['x'];
        actor.player.p.y = data['y'];
        actor.player.p.sheet = data['sheet'];
        actor.player.p.update = true;

      }else{
        var temp = new Q.Actor({ playerId: data['playerId'], x: data['x'], y: data['y'], sheet: data['sheet'] });
        players.push({ player:temp, playerId: data['playerId'] });
        stage.insert(temp);
      }

    });
  }


  //////////////////////////////////configurate the client side with quintus
  Q.scene('arena', function (stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));
    setUp(stage);
   // var player = stage.insert(new Q.Player({ x: 100, y: 100 }));
   // stage.add('viewport').follow(player);
  });
 
  var files = [
    '/images/tiles.png',
    '/maps/arena.json',
    '/images/sprites.png',
    '/images/sprites.json'
  ];
 
  Q.load(files.join(','), function () {
    Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
    Q.compileSheets('/images/sprites.png', '/images/sprites.json');
    Q.stageScene('arena', 0);
  });
});