<?php
  $database = "database.txt";

  $tag = htmlspecialchars($_GET["tag"]);

  $data = read();
  $json = json_decode($data);
  $players = $json->{'players'};

  // ID
  if($tag == "ID"){
    $username = $_GET["username"];
    $color = $_GET["color"];
    $id = $json->{'id'};

    $newplayer;
    $newplayer->{'id'} = $id;
    $newplayer->{'name'} = $username;
    $newplayer->{'clr'} = $color;

    array_push($players,$newplayer);

    write('players',$players);
    write('id',($id+1));

    echo (json_encode($newplayer));

  // PD - PlayerData
} else if($tag == "PD"){
    // Update the database with new info from player
    $id = htmlspecialchars($_GET["id"]);
    for($i = 0; $i < count($players); $i++){
      if($players[$i]->{'id'} == $id){
        $players[$i]->{'x'} = htmlspecialchars($_GET["left"]);
        $players[$i]->{'y'} = htmlspecialchars($_GET["top"]);
        $players[$i]->{'rot'} = htmlspecialchars($_GET["rotate"]);
        //$players[$i]->{'bts'} = json_decode($_GET["bullets"]);
        //$players[$i]->{'coll'} = $_GET["collision"];
      }
    }
    write('players',$players);
    echo (json_encode($players));
  }

  // Read one line from databese. The JSON
  function read(){
    $myfile = fopen("database.txt", "c+b") or die("Unable to open file!");
    if(flock($myfile, LOCK_EX)) {
      $content = fgets($myfile);

      fflush($myfile);
      flock($myfile, LOCK_UN);
      fclose($myfile);
      return $content;
    }
    //return file_get_contents("database.txt", LOCK_EX);
  }

  // Write $val to $obj in JSON
  function write($obj,$val){
    $content = read();
    $json = json_decode($content);
    $json->{$obj} = $val;
    $myfile = fopen("database.txt", "cb") or die("Unable to open file!");

    if(flock($myfile, LOCK_EX)) {
      ftruncate($myfile,0);
      fwrite($myfile,json_encode($json));
    }

    fflush($myfile);
    flock($myfile, LOCK_UN);
    fclose($myfile);
  }
?>
