const server_config = require('/home/ahnhc/config.json');
const mongoose = require('mongoose');
const auto_increment = require('mongoose-auto-increment');

const connection = mongoose.createConnection(server_config.server.db_url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
auto_increment.initialize(connection);

const Schema = mongoose.Schema;
/*
	id : 고유값
	title : 제목
	Content : 내용
	writer : 작성자
	createDate : 작성일
	count : 방문 횟수
	categoryId : Category Mid ID
	hitCount : Post 조회수
	thumbnail : 썸네일 String
*/
const md = {
	model: 'md_post',
	field: '_id',
	startAt: 1,
	increment : 1
}
const postSchema = new Schema({
	_id: { type:Number, default: 0 },
	title: String,
	content: String,
	writer: String,
	createDate: String,
	categoryId: { type:Number, default:0 },
	hitCount: { type:Number, default:0 },
	thumbnail: String
});
postSchema.plugin( auto_increment.plugin, md );
module.exports = connection.model(md.model, postSchema);