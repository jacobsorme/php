<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>play</title>
<script type="text/javascript" src="script.js">
  function startup() {
    var username = "<?php echo ((string)$_GET["username"]) ?>";
    communicate(idMessage(username),createPlayer);
    start();
    document.write("nibba");
    console.log("nihhi");
  }
  window.onload = startup;
</script>
</head>

<body>


<h3>Welcome <?php echo $_GET["username"]; ?> (with ID <?php echo $_GET["id"] ?>) - let's play!</h3>




<div id="values"></div>
<div id="frame" style="position:absolute;left:0px;top:100px;width:800px;height:500px;"></div>


<table style="width:500px">
 <tr>
   <td id="recv"></td>
   <td id="send"></td>
 </tr>
</table>


</body>
</html>
