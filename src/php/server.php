<?php
  include 'readwrite.php';

  // Get the database from game.database from play.php
  $database = "rooms/room". htmlspecialchars($_GET["db"]).".txt";

  $data = read($database);
  $json = json_decode($data);
  $players = $json->{'players'};
  $oldplayer;
  $newplayer;
  $id = htmlspecialchars($_GET["id"]);
  for($i = 0; $i < count($players); $i++){
    if($players[$i]->{'id'} == $id){
      $oldplayer = clone $players[$i];
      $players[$i]->{'x'} = (int) htmlspecialchars($_GET["x"]);
      $players[$i]->{'y'} = (int) htmlspecialchars($_GET["y"]);
      $players[$i]->{'rot'} = (int) htmlspecialchars($_GET["rot"]);   // rotation
      $players[$i]->{'grot'} = (int) htmlspecialchars($_GET["grot"]);
      $players[$i]->{'spd'} = (int) htmlspecialchars($_GET["spd"]);   // speed
      $players[$i]->{'bts'} = json_decode($_GET["bts"]);        // bullets
      $players[$i]->{'col'} = $_GET["col"];                     // collisioncount
      $players[$i]->{'gas'} = $_GET["gas"];
      $players[$i]->{'rotSpd'} = (int) htmlspecialchars($_GET["rotSpd"]);
      $newplayer = $players[$i];
    }
  }
  if($oldplayer != $newplayer){
      write('players',$players,$database);
  }
  echo (json_encode($players));
?>
