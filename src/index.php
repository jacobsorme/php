<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<link href='https://fonts.googleapis.com/css?family=Titan One' rel='stylesheet'>
<title>JetLag</title>

<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-4262822256653950",
    enable_page_level_ads: true
  });
</script>

</head>
<body>

<div style="position:absolute;background-color:#000;width:100%;margin:0;padding:0;left:0px;top:0px;">
<table cellpadding="20px" style="margin:0px">
  <tr>
    <td>
      <a href="index.php" style="color:#fff;  font-size:30px">Home</a>
    </td>
    <td>
      <a href="about.php" style="color:#fff; font-size:30px">About</a>
    </td>
    <td>
      <a href="partners.php" style="color:#fff; font-size:30px">Partners</a>
    </td>
  </tr>
</div>

</table>
      <div id="login">
        <center><h1 id="title">JetLag</h1></center>
        <form method="get" id="form" action="play.php" autocomplete="off">
          <center>
            <input type="text" id="username" name="username" placeholder="username" maxlength="20"><p>
            <b style="color:red;">R:</b>
            <input type="range" id="r" name="r" value="102" min="102" max="255" step="17" onkeydown="color()" onmousemove="color()"><br>
            <b style="color:green;">G:</b>
            <input type="range" id="g" name="g" value="102" min="102" max="255" step="17" onkeydown="color()" onmousemove="color()"><br>
            <b style="color:blue;">B:</b>
            <input type="range" id="b" name="b" value="102" min="102" max="255" step="17" onkeydown="color()" onmousemove="color()"><p><br>
            <hr><p><br>
            Choose a room:<input type="button" style="margin-left:50px;" onclick="callForRooms()" value="Update">
            </center>
            <div id="roomsFromServer"></div>

          </form>
      </div>


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
