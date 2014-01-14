/*
 * Trash 30 Application for Mycroft
 * Sends commands to the central server every hour, on the half hour.
 * (I.E. 12:30, 1:30, etc.)
 */

//Connect to central mycroft server

var app = require('./app.js');
var client = app.connectToMycroft();
var fs = require('fs');
app.sendManifest(client, './app.json');
var cronJob = require('cron').CronJob;

var verified = false; //Set to true when APP_MANIFEST_OKAY received

client.on('data', function (data) {
  parsed = app.parseMessage(data);
  //Check the type of ths message
  if (parsed.type === 'APP_MANIFEST_OK' || 'APP_MANIFEST_FAIL') {
    var dependencies = app.manifestCheck(data);
    verified = true;

  } else if (parsed.type === 'MSG_QUERY') {
    console.log('Query received');

  } else if (parsed.type === 'MSG_QUERY_SUCCESS') {
    console.log('Query successful');

  } else if (parsed.type === 'MSG_QUERY_FAIL') {
    console.error('Query Failed.');
    throw parsed.data.message;

  } else {
    console.log('Message Receieved');
    console.log(' - Type: ' + parsed.type);
    console.log(' - Message:' + JSON.stringify(parsed.data));
  }
  

  if(dependencies){
    if(dependencies.logger == 'up'){
      app.up(client);
    }
  }
});

var array = loadMessages();
var message = "";

new cronJob('0-59 * 10-18 * * *', function(){
  if (verified) {
    message = getRandomMessage(array);
    informRoom(message);
  }
}, null, true);

client.on('end', function() {
  console.log('client disconnected');
});

function informRoom(message){
  var msg = ('[INFO] [' + getTime() + '] Sending trash 30 query');
  console.log(msg);
  app.broadcast(client, msg);
  app.query(client, 'tts', 'say', [message]);
}

function getTime(){
  var date = new Date();
  var split = /(\d+)-(\d+)-(\d+)T(.*)\.(.*)/.exec(date.toISOString());
  return (
    split[2] + '/' +
    split[3] + '/' +
    split[1] + ' ' +
    split[4]
  );
}

function getRandomMessage(messageArray){
  var randomNumber=Math.floor(Math.random()*messageArray.length)
  return messageArray[randomNumber];
}

function loadMessages(){
  var array = fs.readFileSync('messages.txt').toString().split("\n");
  for(i in array) {
      console.log(array[i]); //Temporary Validation
  }
  return array;
}