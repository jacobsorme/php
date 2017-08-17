<?php
  include 'readwrite.php';

  $database = "rooms/room".$_GET["database"].".txt";

  $tag = htmlspecialchars($_GET["tag"]);

  $data = read($database);
  $json = json_decode($data);
  $players = $json->{'players'};

  // ID
  // if($tag == "ID"){
  //   $username = $_GET["username"];
  //   $color = $_GET["color"];
  //   $id = $json->{'id'};
  //
  //
  //   $newplayer;
  //   $newplayer->{'id'} = $id;
  //   $newplayer->{'name'} = $username;
  //   $newplayer->{'clr'} = $color;
  //
  //   array_push($players,$newplayer);
  //
  //   write('players',$players,$database);
  //   write('id',($id+1),$database);
  //
  //   echo (json_encode($newplayer));

  // PD - PlayerData
if($tag == "PD"){
    // Update the database with new info from player
    $id = htmlspecialchars($_GET["id"]);
    for($i = 0; $i < count($players); $i++){
      if($players[$i]->{'id'} == $id){
        $players[$i]->{'x'} = htmlspecialchars($_GET["left"]);
        $players[$i]->{'y'} = htmlspecialchars($_GET["top"]);
        $players[$i]->{'rot'} = htmlspecialchars($_GET["rotate"]);
        $players[$i]->{'bts'} = json_decode($_GET["bullets"]);
        $players[$i]->{'col'} = $_GET["collision"];
        $players[$i]->{'gas'} = $_GET["gas"];
      }
    }
    write('players',$players,$database);
    echo (json_encode($players));
  }


?>
