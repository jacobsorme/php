<?php

// Read one line from databese. The JSON
function read($filename){
  $myfile = fopen($filename, "rb") or die("Error");
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
function write($obj,$val,$filename){
  $content = read($filename);
  $json = json_decode($content);
  $json->{$obj} = $val;
  $myfile = fopen($filename, "cb") or die("Error");

  if(flock($myfile, LOCK_EX)) {
    ftruncate($myfile,0);
    fwrite($myfile,json_encode($json));
  }

  fflush($myfile);
  flock($myfile, LOCK_UN);
  fclose($myfile);
}

function create($path){
  $myfile = fopen($path,"w");
}

 ?>
