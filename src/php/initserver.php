<?php
  /*
    This file handle the initiation of things when a player press play on index.php
  */

  include 'readwrite.php';

  $username = $_GET["username"];
  $color = $_GET["color"];
  $roomId = $_GET["room"];

  // If the player chose to create a new room
  if($roomId < 1){
    // Create and initiate a new room in rooms folder
    $roomsobj = json_decode(read("rooms.txt"));
    $newroomId = $roomsobj->{'id'};
    $file = fopen("rooms/room".$newroomId.".txt","w");
    fwrite($file,"{\"players\":[],\"id\":0}");
    fclose($file);
    write('id',($newroomId+1),"rooms.txt");

    // Add the player to the room
    $newroomobj = json_decode(read("rooms/room".$newroomId.".txt"));
    $id = $newroomobj->{'id'};
    $newplayer;
    $newplayer->{'id'} = $id;
    $newplayer->{'name'} = $username;
    $newplayer->{'clr'} = $color;
    $newplayer->{'room'} = $newroomId;

    $players = $newroomobj->{'players'};
    array_push($players,$newplayer);

    write('players',$players,"rooms/room".$newroomId.".txt");
    write('id',($id+1),"rooms/room".$newroomId.".txt");

    // Write the new room to room database
    // Here is where the name of the room gets set
    $rooms = $roomsobj->{'rooms'};
    $newroom->{'id'} = $newroomId;
    $newroom->{'name'} = $username."'s Room";
    array_push($rooms,$newroom);
    write('rooms',$rooms,"rooms.txt");

    echo (json_encode($newplayer));

  // If the player chose to join a existing room
  // Here one could check eg. how many players that are written to the room,
  // and then have some max number of players.
  } else {
    $thisroomobj = json_decode(read("rooms/room".$roomId.".txt"));
    $id = $thisroomobj->{'id'};
    $newplayer;
    $newplayer->{'id'} = $id;
    $newplayer->{'name'} = $username;
    $newplayer->{'clr'} = $color;
    $newplayer->{'room'} = $roomId;

    $players = $thisroomobj->{'players'};
    array_push($players,$newplayer);

    write('players',$players,"rooms/room".$roomId.".txt");
    write('id',($id+1),"rooms/room".$roomId.".txt");

    echo (json_encode($newplayer));
  }

  ?>
