<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="mystyle.css">
<title>play</title>

</head>

<body>
  <script type="text/javascript" src="script.js">
    start();
  </script>
<h1>Welcome <?php echo $_get["username"] ?> - let's play!</h1>

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
