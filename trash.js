/*
 * Trash 30 Application for Mycroft
 * Sends commands to the central server every hour, on the half hour.
 * (I.E. 12:30, 1:30, etc.)
 */

//Connect to central mycroft server
var app = require('./app.js');
var client = app.connectToMycroft();
app.sendManifest(client, './app.json');

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

client.on('end', function() {
  console.log('client disconnected');
});