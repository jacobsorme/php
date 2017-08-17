<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<link href='https://fonts.googleapis.com/css?family=Titan One' rel='stylesheet'>
<title>JetLag</title>
</head>
<body>

<table>
  <tr>
    <td>
      <div id="login">
        <center><h1 id="title">JetLag</h1></center>
        <form method="get" id="form" action="play.php" autocomplete="off">
          <center>
            <input type="text" id="username" name="username" placeholder="username" maxlength="20"><p>
            <b style="color:red;">R:</b>
            <input type="range" id="r" name="r" value="102" min="102" max="238" step="17" onkeydown="color()" onmousemove="color()"><br>
            <b style="color:green;">G:</b>
            <input type="range" id="g" name="g" value="102" min="102" max="238" step="17" onkeydown="color()" onmousemove="color()"><br>
            <b style="color:blue;">B:</b>
            <input type="range" id="b" name="b" value="102" min="102" max="238" step="17" onkeydown="color()" onmousemove="color()"><p><br>
            <hr><p><br>
            Choose a room:<input type="button" style="margin-left:50px;" onclick="callForRooms()" value="Update">
            </center>
            <div id="roomsFromServer"></div>

          </form>
      </div>
    </td>
  </tr>

</table>

<script src="script/communicate.js"></script>

<script>
function rooms(answer){
  document.getElementById("roomsFromServer").innerHTML = answer;
}
function message(){
  return "";
}
function callForRooms(){
  communicate(message,rooms,"php/roomshow.php");
}

window.onload = callForRooms();

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
