const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	userId: String,
	guildId: String,
	xp: {
		type: Number,
		default: 0
	},
	messages: {
		type: Number,
		default: 0
	},
	lastDaily: {
		type: Date,
		default: null
	}
});

module.exports = mongoose.model('User', userSchema);
