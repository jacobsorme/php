<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>play</title>
</head>
<body style="overflow:hidden">
<!-- <h3 id="welcome"></h3> -->
<a href="index.php"><h3>Home</h3></a>
<!-- <div id="values"></div><p><br> -->
<!-- <div id="frame" style="position:absolute;left:0px;top:100px;width:800px;height:500px;"></div> -->

<table id="data">
</table>

<canvas id="frame" width="1080" height="720" style="border:1px solid #000"></canvas>




<!-- <table id="connections">
  <tr>
    <th>sendage</th>
    <th>receive</th>
  </tr>
</table> -->
<script src="script/math.js"></script>
<script src="script/communicate.js"></script>
<script src="script/collision.js"></script>
<script src="script/render.js"></script>
<script src="script/physics.js"></script>
<script src="script/script.js"></script>

<script>
  window.onload = function(){
    var username = "<?php echo htmlspecialchars($_GET["username"]) ?>";
    if(username == ""){
      username = "xX_NoName_Xx";
    }
    var r = "<?php echo htmlspecialchars($_GET["r"]) ?>";
    var g = "<?php echo htmlspecialchars($_GET["g"]) ?>";
    var b = "<?php echo htmlspecialchars($_GET["b"]) ?>";
    var roomId = "<?php echo htmlspecialchars($_GET["room"]) ?>";

    console.log(roomId);

    function setup() {
      communicate(idMessage.bind(null,username,r,g,b,roomId),start,"php/initserver.php");
    }

    setup();
  }



</script>
</body>
</html>
