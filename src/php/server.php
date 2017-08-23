<?php
  include 'readwrite.php';

  // Get the database from game.database from play.php
  $database = "rooms/room". htmlspecialchars($_GET["db"]).".txt";

  $data = read($database);
  $json = json_decode($data);
  $players = $json->{'players'};

  $time = (int) substr(time(),-3);
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
      $players[$i]->{'time'} = $time;
      $newplayer = $players[$i];
    }
  }
  write('time',$time,$database);
  write('players',$players,$database);
  echo (json_encode($players));

  // Check if there are players to remove -
  $random = rand(0,100);
  if($random < 5){
    for($i = 0; $i < count($players); $i++){
      $ptime = $players[$i]->{'time'};
      // Check so that the player isn't new - with time 0
      if($ptime != 0){
        if(abs($time - $ptime) > 45){
          array_splice($players,$i,1);
          write('players',$players,$database);
        }
      }

    }
  }


?>
