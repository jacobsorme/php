<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<link href='https://fonts.googleapis.com/css?family=Titan One' rel='stylesheet'>
<title>JetLag</title>
</head>
<body>

<div style="position:absolute;background-color:#000;width:100%;margin:0;padding:0;left:0px;top:0px;">
  <div style="width:50%;">
    <a href="index.php" style="color:#fff; font-size:20px">Home</a>
    <a href="about.php" style="color:#fff; font-size:20px">About</a>
    <a href="partners.php" style="color:#fff; font-size:20px">Partners</a>
  </div>
</div>
<div id="setup">
<div id="login">
  <center><h1 id="title">JetLag</h1></center>
  <form id="form" autocomplete="off">
    <center>
      <input type="text" id="username" name="username" placeholder="username" maxlength="20"><p>
      <b style="color:red;">R:</b>
      <input type="range" id="r" name="r" value="102" min="102" max="255" step="17" onkeydown="color()" onmousemove="color()"><br>
      <b style="color:green;">G:</b>
      <input type="range" id="g" name="g" value="102" min="102" max="255" step="17" onkeydown="color()" onmousemove="color()"><br>
      <b style="color:blue;">B:</b>
      <input type="range" id="b" name="b" value="102" min="102" max="255" step="17" onkeydown="color()" onmousemove="color()"><p>
      <hr><p>
      Choose a room:
    </center>
    <center><p><input type="button" value="Play" onclick="setup()"></center>
  </form>
</div>
</div>

<script src="/socket.io/socket.io.js"></script>
<script src="script/math.js"></script>
<script src="script/communicate.js"></script>
<script src="script/collision.js"></script>
<script src="script/render.js"></script>
<script src="script/physics.js"></script>
<script src="script/script.js"></script>


<div id="values"> AKJSH S</div>
<div style="position:fixed;left:0.5%;" id="data"></div>
<div style="position:fixed;left:20%;top:1%" id="content"></div>



<script>
function setup() {
  var username = document.getElementById("username").value;
  var r = document.getElementById("r").value;
  var g = document.getElementById("g").value;
  var b = document.getElementById("b").value;
  send("id",idMessage(username,r,g,b));
}

function color(){
  var r = document.getElementById("r").value;
  var g = document.getElementById("g").value;
  var b = document.getElementById("b").value;
  document.getElementById("login").style.backgroundColor = "rgb("+r+","+g+","+b+")";
  //document.getElementById("title").style.color = "rgb("+ (255-r)+","+(255-g)+","+(255-b)+")";
}

</script>
</body>
</html>
