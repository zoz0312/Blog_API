const server_config = require('/home/ahnhc/config.json');
const mongoose = require('mongoose');
const auto_increment = require('mongoose-auto-increment');

const connection = mongoose.createConnection(server_config.server.db_url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
auto_increment.initialize(connection);

const Schema = mongoose.Schema;
/*
    id : 고유값
    parentId : 상위 Depth ID
    title : Category TOP title
    no : 카테고리 순서
*/
const md = {
	model: 'md_category',
	field: '_id',
	startAt: 1,
	increment : 1
}
const categorySchema = new Schema({
    _id: { type:Number, default: 0 },
    title: { type: String, default: '' },
    no: { type: Number, default: 0 },
    parentIdx: { type: String, default: '0' }
});
categorySchema.plugin( auto_increment.plugin, md );
module.exports = connection.model(md.model, categorySchema);