<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>php</title>

</head>


<body>
  <script src="script.js">
  </script>

  <script>
  function response1(text){
    document.getElementById("input_response").value = text;
    return true;
  }

  function setup(){
    return communicate("test=ok",response1);
  }

  // response is a function
  function comm(){
    communicate("test=ok",response2,append);
  }

  function response2(text,callback){
    callback(text);
  }

  function falser() {
    return false;
  }

  </script>

<div id="response">


</div>

<input id="input_response">

<input type="button" onclick="comm()">

<div style="position:absolute;left:50%; transform:translate(-50%,0);">
<h1 id="h1">Prototype</h1>
<form method="get" action="play.php" onsubmit="return falser()">
<input type="text" id="username" name="username"><p>
<input type="text" id="id" name="id" style="display:none"><p>
<input type="submit" value="Play">
</form>
</div>


</body>
</html>
