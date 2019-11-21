#!/usr/bin/nodejs
var debug = require('debug')('my-application');

var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

/*===== S:DB Connection =====*/
const mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});
/*===== E:DB Connection =====*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*===== S:Access-Control-Allow =====*/
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
/*===== E:Access-Control-Allow =====*/

/*===== S:Methods Block =====*/
app.options('*', (req, res, next) => {
    res.status(404).end();
    res.end();
});
app.head('*', (req, res, next) => {
    res.status(404).end();
    res.end();
});

const category = require('./model/category');
const posts = require('./model/post');
app.get('/', function(req, res) {
    res.render('index', { title: 'API SERVER' });
});
app.get('/xml', async (req, res, next) => {
	const xml_map = [];
	let i = 0;
	let j = 0;
	category.find({}, {_id: true, parentIdx: true}).then(category => {
		let remove_arr = [];
		let ctLen = category.length;

		for( i; i<ctLen; i++ ){
			const arr = category[i].parentIdx.split('.');
			const len = arr.length;
			if( len === 2 ){
				if( remove_arr.indexOf(arr[0]) === -1 ){
					remove_arr.push(arr[0]);
				}
			} else if( len === 3 ){
				if( remove_arr.indexOf(arr[0]+'.'+arr[1]) === -1 ){
					remove_arr.push(arr[0]+'.'+arr[1]);
				}
			}
		}
		for( j; j<ctLen; j++ ){
			if( remove_arr.indexOf(category[j].parentIdx) === -1 ){
				xml_map.push(`/list/${category[j]._id}`)
			}
		}
		return posts.find({}, {_id: true});
	}).then(posts => {
		xml_map.push(...posts.map(rtn => `/posts/read/${rtn._id}`));
		res.send(xml_map);
	}).catch(err => {
		res.send(err);
	});
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.set('port', process.env.PORT || 3001);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
