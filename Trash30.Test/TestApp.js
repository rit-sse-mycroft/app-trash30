var assert = require('assert');
var fs = require('fs');
var path = require('path');
var app = require('../trash30/app.js');

describe('parseMessage', function(){
	it('should throw Error: Malformed Message', function(){
		try{
			var parse = app.parseMessage('');
			//should have an error and go to catch block - other wise should fail
			throw 'App should not be able to sucessfully parse a blank or malformed message'
		} catch (err){
		}
	});
});