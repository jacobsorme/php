
function Game(){
    this.canvas = null;
    this.ctx = null;
    this.localPlayer = null;
    this.oldLocalPlayer = null;
    this.globalPlayers = new Map();
    this.runInterval = null;
    this.runTime = null;
    this.sendInterval = null;
    this.sendTime = null;
    this.keys = null;
    this.keymap = null;
    this.bulletSpeed = 0;
    this.pointsList = null;
    this.forceIncr = 1;
    this.forceDecr = 0.96;
    this.forceMin = 0.1;
    this.rotChange = 1;
    this.rotMaxSpeed = 6;
    this.terminal = null;
}

Game.prototype = {
    setPlayer: function(p){
        this.localPlayer = p;
    },
    getPlayer: function(){
        return this.localPlayer;
    },
    setCanvas: function(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    },
    getWidth: function(){
        return this.canvas.width;
    },
    getHeight: function(){
        return this.canvas.height;
    },
    destroy: function(){
        clearInterval(this.runInterval);
        clearInterval(this.sendInterval);
    },
    // Converts a server player to a client-like player.
    // Also does checks on new incoming data VS last. This should affect globalPlayers.
    setglobalPlayers: function(data){
        /* Give a already stored player some updates
         Includes probability on updates that are non-critical
         */
        if(this.globalPlayers.has(data.id)){
            var p = this.globalPlayers.get(data.id);
            if(data.weight == 1) {
                p.x = data.x;
                p.y = data.y;
                p.bullets = data.bullets;
                p.force = data.force;
                p.gas = data.gas;
                p.rot = data.rot;
                p.rotSpeed = data.rotSpeed;
                p.collisionCount = data.collisionCount;
            }
            else if(data.weight == 0)  {
                p.rotSpeed = data.rotSpeed;
                p.force = data.force;
                p.bullets = data.bullets;
                p.collisionCount = data.collisionCount;
                p.gas = data.gas;
            } else {
                this.globalPlayers.set(data.id,p);
            }
        } else {
            // A new player was found - this new one will need a full message from us

            playerDataSend(dataMessageFull,false);
            var p = new Player(data.name,data.id,data.socket,data.color);
            p.setPosition(data.x,data.y,data.rot);
            p.setRotSpeed(data.rotSpeed);
            p.setForceParameters(data.force);
            console.log("NEW DATA"+JSON.stringify(data));
            this.globalPlayers.set(data.id,p);
        } //Store a fully equipped player
    }
}


// Class Player
function Player(name,id,socket,color){
    this.name = name;
    this.id = id; // Not required globally
    this.socket = socket;
    this.x = null;
    this.y = null;
    this.rot = null;
    this.color = color;
    this.force = [0,0];
    this.forceIncr = game.forceIncr;
    this.forceDecr = game.forceDecr;
    this.forceMin = game.forceMin;
    this.bullets = [];
    this.collisionCount = 0;
    this.bulletId = 0; // Not required globally
    this.shootTime = null; // Not required globally
    this.penetration = [];
    this.gas = 0;
    this.rotSpeed = null;
    this.rotMaxSpeed = game.rotMaxSpeed;
    this.rotChange = game.rotChange;
}

Player.prototype = {
    setPosition: function(x,y,rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;
    },
    setForceParameters: function(force){
        this.force = force;
    },
    setRotSpeed: function(rotSpeed){
        this.rotSpeed = rotSpeed;
    },
    convertToLight: function(){
        return new LightPlayer(this);
    },
    convertToExtraLight: function(){
        return new ExtraLightPlayer(this);
    },
    // OBS - this function depends on how LightPlayer looks
    convertFromLight: function(data){
        this.x = data.x;
        this.y = data.y;
        this.bullets = data.bullets;
        this.force = data.force;
        this.gas = data.gas;
        this.rot = data.rot;
        this.rotSpeed = data.rotSpeed;
        this.collisionCount = data.collisionCount;
    },
    // OBS - this function depends on how ExtraLightPlayer looks
    convertFromExtraLight: function(data){
        this.force = data.force;
    }
}

function LightPlayer(p){
    this.weight = 1;
    this.force = p.force;
    this.id = p.id;
    this.rotSpeed = p.rotSpeed;
    this.x = p.x;
    this.y = p.y;
    this.rot = p.rot;
    this.bullets = p.bullets;
    this.collisionCount = p.collisionCount;
    this.gas = p.gas;
}

/* Extra light player - good for tight sending.
 Has type 0 - extra light
 */
function ExtraLightPlayer(p){
    this.weight = 0;
    this.force = p.force;
    this.rotSpeed = p.rotSpeed;
    this.id = p.id;
    this.bullets = p.bullets;
    this.collisionCount = p.collisionCount;
    this.gas = p.gas;
}

function Bullet(playerId,id,x,y,rot){
    this.id = id;
    this.x = x;
    this.y = y;
    this.rot = rot;
    this.bounce = 0;
}

function Terminal(){
    this.maxlength = 20;
    this.terminal = document.createElement("div");
    this.terminal.id = "terminal";

    this.chat = document.createElement("div");
    this.chat.id = "terminal-chat";
    this.terminal.appendChild(this.chat);

    this.send = document.createElement("input");
    this.send.type="button";
    this.send.value="Send";
    this.send.onclick=chatSend;
    this.textbox = document.createElement("input");
    this.textbox.type="text";
    this.terminal.appendChild(this.send);
    this.terminal.appendChild(this.textbox);
    this.messages = [];
}

Terminal.prototype = {
    setup: function(goal){
        goal.appendChild(this.terminal);
    },
    clearMessage: function(){
        this.textbox.value ="";
    },
    getMessage: function(){
        var m = this.textbox.value;
        if(this.messages.length>=this.maxlength) this.messages.shift();
        this.messages.push(m);
        this.chat.innerHTML ="";
        for(var i in this.messages){
            this.chat.innerHTML += this.messages[i]+"<br>";
        }
        this.clearMessage();
        return m;

    },
    appendMessage:function(msg){
        if(this.messages.length>=this.maxlength) this.messages.shift();
        this.messages.push(msg);
        this.chat.innerHTML="";
        for(var i in this.messages){
            this.chat.innerHTML += this.messages[i]+"<br>";
        }
    }
};