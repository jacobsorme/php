<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<link href='https://fonts.googleapis.com/css?family=Titan One' rel='stylesheet'>
<title>JetLag</title>
</head>
<body>

<table style="border-style:solid; border-width:1px;">

  <tr>
    <td>
      <div id="login">
        <center><h1 id="title">JetLag</h1></center>
<form method="get" id="form" action="play.php" autocomplete="off">
          <center>
            <input type="text" id="username" name="username" placeholder="username" maxlength="20"><p>
            <b style="color:red;">R:</b>
            <input type="range" id="r" name="r" value="68" min="68" max="238" step="17" onkeydown="color()" onmousemove="color()"><br>
            <b style="color:green;">G:</b>
            <input type="range" id="g" name="g" value="68" min="68" max="238" step="17" onkeydown="color()" onmousemove="color()"><br>
            <b style="color:blue;">B:</b>
            <input type="range" id="b" name="b" value="68" min="68" max="238" step="17" onkeydown="color()" onmousemove="color()"><p>
            <h3>Choose a room:</h3> <br>
          </center>
          </form>
      </div>
    </td>
  </tr>

</table>

<script src="script/communicate.js"></script>

<script>
function rooms(answer){
  document.getElementById("form").innerHTML += answer;
}
function message(){
  return "";
}

window.onload = function() {
  communicate(message,rooms,"php/roomshow.php");
};

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
