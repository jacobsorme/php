<?php
  include "readwrite.php";

  $data = read("rooms.txt");
  $json = json_decode($data);
  $rooms = $json->{'rooms'};
  //echo json_encode($rooms);
  for($i = 0; $i < count($rooms); $i++){
    echo "<input type=\"radio\" name=\"room\" value=\"". $rooms[$i]->{"id"} ."\">". $rooms[$i]->{"name"} . "<br>";
  }
  echo "<input type=\"submit\" value=\"Play\">";
?>
