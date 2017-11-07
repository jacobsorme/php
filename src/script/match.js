/**
 * Created by jacob_000 on 2017-10-28.
 */


function displayControls(){
    var start = document.createElement("input");
    start.type ="button";
    start.value="Start Game";
    start.onclick = startGame;
    document.getElementById("controls").appendChild(start);
}
function startGame(){
    var pos = {
        id:game.localPlayer.id,
        x: Math.round(Math.random()*game.getWidth()),
        y:Math.round(Math.random()*game.getHeight()),
        rot: Math.round(Math.random()*360)
    }
    stopRunning();
    game.localPlayer.setPosition(pos.x,pos.y,pos.rot);
    send("match-start",JSON.stringify(pos));
    setTimeout(function(){alert("GO!")},5000);
}

function stopRunning(){
    clearInterval(game.runInterval);
    clearInterval(game.sendInterval);
}

function startSequence(pos){
    game.globalPlayers.get(pos.id).x = pos.x;
    game.globalPlayers.get(pos.id).y = pos.y;
    game.globalPlayers.get(pos.id).rot = pos.rot;
    display();

    var pos = {
        id:game.localPlayer.id,
        x: Math.round(Math.random()*game.getWidth()),
        y:Math.round(Math.random()*game.getHeight()),
        rot: Math.round(Math.random()*360)
    }
    send('match-pos',JSON.stringify(pos));
    game.localPlayer.setPosition(pos.x,pos.y,pos.rot);
    render(game.localPlayer);
    setTimeout(function(){alert("GO!")},5000);
}