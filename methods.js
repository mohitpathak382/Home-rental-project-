var express = require('express');
var path=require('path');
const split = require('split-string');
var fs = require('fs');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const db = require('./config.js');
var connection = db.connection;

module.exports.insertValues = function(house, likedBy) 
{
	connection.query("SELECT * FROM rlikes where house = ?",[house],function(err,results,fields)
	{
		if(err)
        {
           	console.log("error at query")
        }
        else
        {
          	if(results.length > 0)
           	{
           		console.log("db",likedBy,house);
           		connection.query("UPDATE rlikes SET likedBy = ? where house=?",[likedBy,house],function(err,results,fields)
           		{
           			if(err)
		            {
		            	console.log("error at query");
		            }
		            else
		            {
            			console.log("likedBy values "+house+" "+likedBy);
           			}
           		});
           	}
           	else
           	{
           		console.log("dber",likedBy,house);
           		connection.query("INSERT INTO rlikes values('"+house+"','"+likedBy+"')",function(err,resultRows,fields)
				{
		            if(err)
		            {
		            	console.log("error at query");
		            }
		            else{
		            	console.log("likedBy values "+house+" "+likedBy);
		            }
				});
           	}
   		}
   	});
}