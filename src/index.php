<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>JetLag</title>
</head>
<body>

<div id="login">
<center>
  <h1 id="title">JetLag</h1>
  <form method="get" action="play.php" autocomplete="off">
  <input type="text" id="username" name="username" placeholder="username" maxlength="20"><p>
  <b style="color:red;">R:</b>
  <input type="range" id="r" name="r" value="24" min="17" max="238" step="17" onkeydown="color()" onmousemove="color()"><br>
  <b style="color:green;">G:</b>
  <input type="range" id="g" name="g" value="24" min="17" max="238" step="17" onkeydown="color()" onmousemove="color()"><br>
  <b style="color:blue;">B:</b>
  <input type="range" id="b" name="b" value="24" min="17" max="238" step="17" onkeydown="color()" onmousemove="color()"><p>
  <input type="submit" value="Play">
</center>

</form>
</div>

<div id="rooms" style="border-style:solid;border-color:#000; border-width:2px;">
Hej
</div>
<script src="script/communicate.js">
function rooms(answer){
  document.getElementById("rooms").innerHTML = answer;
}
function message(){
  return "";
}

communicate(message,rooms,"php/roomserver.php");

</script>
<script>
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
