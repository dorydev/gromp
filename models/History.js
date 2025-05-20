const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
	tag: String, 
	data: {
		type: Map,
		of: String 
	},
	timestamp: {
		type: Date,
		default: Date.now
	},
	date: {
		type: String,
		default: 0
	}
});

module.exports = mongoose.model('History', historySchema);
