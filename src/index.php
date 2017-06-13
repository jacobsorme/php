<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>php</title>

</head>


<body>
  <script src="script.js">
  </script>

  <script>
  function response(text){
    document.getElementById("id").innerHTML = text;
  }

  function setup(){
    communicate(idMessage(document.getElementById("username")),response);
  }



  </script>

<input type="button" onclick="ass()">

<div style="position:absolute;left:50%; transform:translate(-50%,0);">
<h1>hooo</h1>
<form method="get" action="play.php">
<input type="text" id="username" name="username"><p>
<input type="text" id="id" name="id" style="display:none">
<input type="submit" value="Play" onclick="">
</form>
</div>


</body>
</html>
