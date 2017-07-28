<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>play</title>
</head>
<body>
<h3 id="welcome"></h3>
<a href="index.php"><h3>Home</h3></a>
<div id="values"></div><p><br>
<!-- <div id="frame" style="position:absolute;left:0px;top:100px;width:800px;height:500px;"></div> -->

<canvas id="frame" width="1080" height="720" style="border:1px solid #000"></canvas>

<table id="data">
</table>


<!-- <table id="connections">
  <tr>
    <th>sendage</th>
    <th>receive</th>
  </tr>
</table> -->

<script type="text/javascript" src="script.js">

</script>
<script>
  var username = "<?php echo htmlspecialchars($_GET["username"]) ?>";
  var r = "<?php echo htmlspecialchars($_GET["r"]) ?>";
  var g = "<?php echo htmlspecialchars($_GET["g"]) ?>";
  var b = "<?php echo htmlspecialchars($_GET["b"]) ?>";

  function setup() {
    communicate(idMessage.bind(null,username,r,g,b),start);
  }

  setup();

</script>
</body>
</html>
