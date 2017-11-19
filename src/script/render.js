function displayData(){
  var html = "<b>";
  html += game.localPlayer.name + ":</b>"
  html += game.localPlayer.collisionCount;
  html += "</br>";
  for(var i = 0; i < game.globalPlayers.length; i++){
    if(game.globalPlayers[i].id != game.localPlayer.id){
      html += "<b>"+ game.globalPlayers[i].name + ":</b>";
      html += game.globalPlayers[i].collisionCount + "<br>";
    }
  }
  document.getElementById("data").innerHTML = html;
}


// Render portals
function portalRender(p){
  var margin = 50;
  var offset = 50;
  var width = game.getWidth();
  var height = game.getHeight();
  var x = p.x;
  var y = p.y;

  if(x+margin > width){
    if(x > (width+margin)){
      p.x = (x-width-offset);
        polygons(p.x,p.y,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    } else {
      polygons(x-width-offset,p.y,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    }
  }else if((x-margin) < 0){
    if(x < -1*margin){
      p.x = (width+x+offset);
      polygons(p.x,p.y,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    } else {
      polygons(width+x+offset,p.y,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    }
  }if((y+margin) > height){
    if(y > (height+margin)){
      p.y = y-height-offset;
      polygons(p.x,p.y,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    } else {
      polygons(p.x,y-height-offset,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    }
  }else if((y-margin) < 0 ){
    if(y < -1*margin){
      p.y = height+y+offset;
      polygons(p.x,p.y,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    } else {
      polygons(p.x,height+y+offset,p.rot,p.gas,["#f60",p.color,"#888","#3FF"]);
    }
  }
}

// Render bullets
function bulletRender(p){
  game.ctx.fillStyle = "#000";
  var bullets = p.bullets;
  for(var i = 0;i < bullets.length; i++){
    var b = bullets[i];
    game.ctx.translate(b.x,b.y);
    game.ctx.rotate(b.rot*(Math.PI/180));
    game.ctx.beginPath();
    game.ctx.arc(0,0,10,0,2*Math.PI);
    game.ctx.fill();
    game.ctx.rotate(-1*b.rot*(Math.PI/180));
    game.ctx.translate(-b.x,-b.y);
  }
}

// Rendering
function render(p){
  //console.log(p.name + "  color:  " + p.color);
  game.ctx.textAlign = "center";
  game.ctx.fillStyle = "#000";
  game.ctx.font = "25px Arial";
  game.ctx.fillText(p.name +": "+ p.collisionCount,p.x,p.y-70);
  bulletRender(p);
  polygons(p.x,p.y,p.rot,p.gas,["#F60",p.color,"#888","#3FF"]);
  portalRender(p);
}

// Draws polygon accordingly
function polygons(x,y,rot,gas,colorList){
  game.ctx.translate(x,y);
  game.ctx.rotate(rot*(Math.PI/180));
  var i = 1;
  // if the gas is on
  if(gas == 1){
    i = 0;
  }
  for(i; i< game.pointsList.length;i++){
    game.ctx.fillStyle = colorList[i];
    game.ctx.strokeStyle = "#000";
    game.ctx.lineWidth = 4;
    game.ctx.beginPath();
    var points = game.pointsList[i];
    for(var j = 0; j < points.length; j++) {
      game.ctx.lineTo(points[j][0],points[j][1]);
    }
    game.ctx.closePath();
    game.ctx.fill();
    game.ctx.stroke();
  }
  game.ctx.rotate(-1*rot*(Math.PI/180));
  game.ctx.translate(-x,-y);
}
