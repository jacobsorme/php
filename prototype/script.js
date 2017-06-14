// Send message to server.php, call callback with answer
function communicate(message,callback,innercallback){
  if (window.XMLHttpRequest) {
    var xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.onreadystatechange= function() {
    if (this.readyState==4 && this.status==200) {
      return callback(this.responseText,innercallback);
    }
  }
  xmlhttp.open("GET","server.php?"+message,true);
  xmlhttp.send();
}
