<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>php</title>


</head>
<script type="text/javascript" src="script.js">
</script>
<script type="text/javascript">
  function initiate() {
    communicate.bind(null,idMessage(document.getElementsByName("username").value),initiateName);
  }

  function initiateName(result){
    document.getElementsByName("id").value = result;
  }
</script>

<body>
<div style="position:absolute;left:50%; transform:translate(-50%,0);">
<h1>- JetLag -  </h1>
<form method="get" action="play.php">
<input type="text" name="username"><br>
<input type="text" name="id" style="display:none"><br>
<input type="submit" value="Play" onclick="initiate()">
</form>
</div>




</body>
</html>
