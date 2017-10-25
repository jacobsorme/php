<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>play</title>
</head>
<body style="overflow:hidden; background-color:#999">
<a href="index.php"><h3>Home</h3></a>

<div style="position:fixed;left:0.5%;" id="data"></div>
<div style="position:fixed;left:20%;top:1%" id="content"></div>

<script src="/socket.io/socket.io.js"></script>
<script src="script/math.js"></script>
<script src="script/communicate.js"></script>
<script src="script/collision.js"></script>
<script src="script/render.js"></script>
<script src="script/physics.js"></script>
<script src="script/script.js"></script>


<script>
  window.onload = function(){
    var username = "<?php echo htmlspecialchars($_GET["username"]); ?>";
    //var username = "YOloer";
    if(username == ""){
      username = "xX_NoName_Xx";
    }
    var r = "<?php echo htmlspecialchars($_GET["r"]) ?>";
    var g = "<?php echo htmlspecialchars($_GET["g"]) ?>";
    var b = "<?php echo htmlspecialchars($_GET["b"]) ?>";
    //var roomId = "<?php echo htmlspecialchars($_GET["room"]) ?>";

    console.log(roomId);

    function setup() {
      send("id",idMessage(username,r,g,b));
    }

    setup();
  }
</script>
</body>
</html>
