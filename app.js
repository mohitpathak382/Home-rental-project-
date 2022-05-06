var express = require('express');
var path=require('path');
var fs = require('fs');
var app = express();
var session = require('express-session');
var moment = require('moment');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const split = require('split-string');
const querystring = require('querystring'); 
const db = require('./config.js');
var connection = db.connection;
let alert = require('alert'); 



app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration:  10 * 1000,
  activeDuration: 10 * 1000,
  resave: true,
  saveUninitialized: true
}));

app.use(express.static(require('path').join(__dirname + '/Public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

users = [];
connections = [];

var urlencodedParser = bodyParser.urlencoded({ extended: false})

app.get('/',function(req,res) {
	res.render( 'start', {
		username: 'hi',
		passwordIncorrect: ' ',
		userNotRegistered: ' '
	});
})
app.get('/login',function(req,res) {
	console.log(req.session.user);
	res.render( 'login', {
		passwordIncorrect: ' ',
		userNotRegistered: ' ',
		loginAgain:' '
	});
})

app.get('/register',function(req,res) {
	res.render( 'register', {
		usernameTaken:' ',
		emailTaken:' '
	});
})

app.get('/house-register',function(req,res) {
	res.render( 'house-register', {
		housetaken:''
	});
})

var members=[[]],others=[[]];

app.get('/dashboard',function(req,res) {
	if(req.session.user&&req.session){
		var otherUsers=[[]];
					connection.query('SELECT * FROM cust WHERE email != ?',[req.session.user.email],function(err,resultRows,fields){
                              res.render( 'welcome', {
								user: req.session.user,
					            members:resultRows

							});
					});
		
	}
	else{
		console.log('Login again!!');
		res.render('login',{
			passwordIncorrect: ' ',
			userNotRegistered: ' ',
			loginAgain:'Session expired, Login Again!! '
		});
	}
});
      
app.post('/login',urlencodedParser,function(req,res){
	var	email = req.body.userEmail;
	var	password = req.body.userPassword;
	
	connection.query('SELECT * FROM cust WHERE email = ?',[email],function(error, results, fields){
		if(error){
			console.log("error");
			res.redirect('/login');
		}
		if(email.length == 0 || password.length == 0)
		{
		    res.render( 'login', {
			passwordIncorrect: 'Insufficient Credentials',
			userNotRegistered: ' ',
			loginAgain: ' '
			});	
		}
        else{
			if(results.length > 0){
				if(results[0].pass==password){
					
					var newUser = {
						uname:results[0].username, 
						mail:results[0].email, 
						contact:results[0].mobile, 
						add:results[0].address,
						gender:results[0].gender,
						password: req.body.userPassword,
					};
					req.session.user=newUser;
					console.log("Login Successful");
					alert("Succesfully Logged in")
					res.redirect('/dashboard');
				}
				else{
					console.log("Password Incorrect");
					res.render( 'login', {
						passwordIncorrect: 'password Incorrect',
						userNotRegistered: ' ',
						loginAgain: ' '
					});
				}
			}
			else{
				console.log("Email Doesn't exist");
				res.render( 'login', {
					userNotRegistered: 'User Not Registered!! Click the Register button',
					passwordIncorrect: ' ',
					loginAgain: ' '
				});
			}
		}
	});
});

app.post('/register',urlencodedParser,function(req,res ,next){
	var uname = req.body.username;
	var mail = req.body.email;
	var contact = req.body.mobile; 
	var add = req.body.address;
	var gender = req.body.gender;
	var password = req.body.password;


	connection.query('SELECT * FROM cust WHERE username = ?',[uname],function(error, results, fields)
	{
		if(error){
			console.log("error at query  level" ,error);
			res.send({
				"code":400,
				"failed":"  Error ocurred"
			});
		}
		else{
			if(results.length > 0)
			{
				
				console.log("USER EXISTS");
				res.render('register', {
					usernameTaken: 'username name taken.. choose other user Name!!',
					emailTaken: ' ',
				});
			}
			else{
				var sql=`insert Into cust(username,email,gender,contact,address,pass) values("${uname}","${mail}","${gender}","${contact}","${add}","${password}")`;
 				connection.query(sql, function(err, result)
				{
					            if(err)
								{
									console.log("error at inserting values main level" , err);
									res.send({
										"code":400,
										"failed":"Error ocurred"
									});
								}
								else
								{
									console.log("Register Successful");
									res
									console.log(uname+" , "+password);
									res.redirect('/login');
	
								}
				});
			}
		}
	});
});

app.post('/house-register',urlencodedParser,function(req,res ,next){
	var username = req.body.username;
	var mobile = req.body.mobile;
	var address = req.body.address; 
	var category = req.body.category;
	var locality = req.body.locality;
	var rent = req.body.rent;
	var facing = req.body.facing;
	var about = req.body.description;
	var bhk = req.body.BHK;


	connection.query('SELECT * FROM house WHERE address = ?',[address],function(error, results, fields)
	{
		if(error){
			console.log("error at query  level" ,error);
			res.send({
				"code":400,
				"failed":"  Error ocurred"
			});
		}
		else{
			if(results.length > 0)
			{
				
				console.log(" HOUSE EXISTS");
				res.render('register', {
					housetaken: 'House taken.. choose another address!!',
					
				});
			}
			else{
				var sql=`insert Into house(locality, category, bedroom, mobile, ownername, about, rent, facing, address) values("${locality}","${category}","${bhk}","${mobile}","${username}","${about}","${rent}","${facing}","${address}")`;
 				connection.query(sql, function(err, result)
				{
					            if(err)
								{
									console.log("error at inserting values main level" , err);
									res.send({
										"code":400,
										"failed":"Error ocurred"
									});
								}
								else
								{
									console.log("Register Successful");
	
									console.log(address+" , "+rent);
									res.redirect('/dashboard');
	
								}
				});
			}
		}
	});
});


app.post('/feedback',urlencodedParser,function(req,res){
	if(req.session&&req.session.user)
	{
		var uname=req.session.user.uname;
		var rating=req.body.star;
		connection.query("UPDATE cust SET feedback = ?  WHERE username = ? ",[rating,uname],function(err,results,fields){
                            if(err)
			 	            {
				            	console.log("error at query" ,err);
								res.send({
								"code":400,
								"failed":"Error ocurred"
								});
				            }
				            else{
				            	console.log("rating updated");
				            	res.redirect('/dashboard');
				            }
		});
	}
   
});


app.get('/dashboard/preference', function(req,res){
	if(req.session && req.session.user)
	{
		var cat=req.query.category;
		var loc=req.query.locality;
		var bed=req.query.bedroom;
		// var gender=req.query.gender;
		var username=req.session.user.uname;
		var sql='SELECT * from house WHERE category=? or bedroom=? or locality=?';
					connection.query(sql,[cat,bed,loc],function(err,results,fields){
						if(err){
							console.log("error at query",err);
							res.send({
								"code":400,
								"failed":"Error ocurred"
							});
						}
						else{
							console.log(bed,cat,loc)
							console.log(results);
							res.render('preference',{
								user:req.session.user,
								members:results
							});
						}
					});
	}
	else{
		console.log('Login again!!');
		res.render('login',{
			passwordIncorrect: ' ',
			userNotRegistered: ' ',
			loginAgain:'Session expired, Login Again!! '
		});
	}
});

app.get('/logout', function(req, res) {
  	req.session.destroy(function(err){
  		if(err){
  			console.log(err);
  		}
  		else {
  			res.redirect('/login');
  		}
  	});
});
app.post('/dashboard/like',urlencodedParser,function(req,res){
	var uname=req.session.user.uname;
	var address=req.query.address;
	console.log(address ,uname)
	});
// dpController(app);
var server = app.listen(8081 , function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log(host+" "+port);
})