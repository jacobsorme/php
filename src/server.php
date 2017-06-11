<?php
  $database = "database.txt";

  // Enable garbage collector (?)
  gc_enable();

  $receive = $_GET["msg"];


  // Convert message to a Object
  $msg = decode($receive);
  //$_SESSION["count"] = $_SESSION["count"] + 1;

  // Echo a valid ID to the client. Read/write to JSON in database
  if($msg->{'type'} == "ID"){
    $jsontext = read();
    $json = json_decode($jsontext);
    $id = $json->{'id'};
    write('id',($id+1));
    echo $id;

  // Ehco the players. Update JSON in database.
  } else if($msg->{'type'} == "PD"){
    $jsontext = read();
    $obj = json_decode($jsontext);
    $players = $obj->{'players'};

    // Update the database with new info from player
    $found = false;
    for($i = 0; $i < count($players); $i++){
      if($players[$i]->{'id'} == $msg->{'id'}){
        $players[$i]->{'left'} = $msg->{'left'};
        $players[$i]->{'top'} = $msg->{'top'};
        $players[$i]->{'rotate'} = $msg->{'rotate'};
        $found = true;
      }
    }
    if(!$found){
      //$newplayer = array('left' => substr($msg,3), 'id' => substr($msg,2,1));
      $newplayer->{'id'} = $msg->{'id'};
      $newplayer->{'left'} = $msg->{'left'};
      $newplayer->{'top'} = $msg->{'top'};
      $newplayer->{'rotate'} = $msg->{'rotate'};
      array_push($players,$newplayer);
    }

    //write('players',$players);


    //Send all the players (except the one the message came from)
    // for($i = 0; $i < count($players); $i++){
    //   if($players[$i]->{'id'} != $msg->{'id'}){
    //     //echo '<div style="position:absolute;width:100px;height:100px;background-color:red;left:' . $players[$i]->{'left'} . 'px;top:' . $players[$i]->{'top'} . 'px;transform:rotate(' . $players[$i]->{'rotate'} . 'deg)">'.  (memory_get_peak_usage()/1000000) .' MB</div>';
    //     echo '<div style="position:absolute;width:100px;height:100px;background-color:red;left:' . $players[$i]->{'left'} . 'px;top:' . $players[$i]->{'top'} . 'px;transform:rotate(' . $players[$i]->{'rotate'} . 'deg)">'.' </div>';
    //   }
    // }
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
    //fwrite($myfile,json_encode($val));
    fflush($myfile);
    flock($myfile, LOCK_UN);
    fclose($myfile);
    //file_put_contents("database.txt",json_encode($json), LOCK_EX);
  }

  // Decode the message from client into a object.
  function decode($message){
    $msg = json_decode($message);

    $obj;
    if($msg->{'tag'} == "ID"){
      $obj->{'type'} = "ID";
      $obj->{'name'} = $msg->{'name'}; 
    } else {
      // Making a object with the string received from client ;
      $obj->{'type'} = (string)$msgarray[0];
      $obj->{'id'} = (int)$msgarray[1];
      $obj->{'left'} = (string)$msgarray[2];
      $obj->{'top'} = (string)$msgarray[3];
      $obj->{'rotate'} = (int)$msgarray[4];
    }
    return $obj;
  }
?>
