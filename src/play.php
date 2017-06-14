<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>play</title>
<script type="text/javascript" src="script.js">

</script>
<script>
var username = "<?php echo $_GET["username"] ?>";



function setup() {
  communicate(idMessage.bind(null,username),start);
}

setup();

</script>
</head>

<body>


<h3 id="welcome"></h3>

<div id="values"></div>
<div id="frame" style="position:absolute;left:0px;top:100px;width:800px;height:500px;"></div>


<!--<table id="connections">
  <tr>
    <th>sendage</th>
    <th>receive</th>
  </tr>
</table>
-->


</body>
</html>
