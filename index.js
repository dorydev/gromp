require('dotenv').config()
const { Client, IntentsBitField, Events } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./src/handlers/eventHandler');
const moment = require('moment');
const config = require('./config.json');

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions
	],
});

client.config = config;

(async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.MONGODB_URI);
		console.log(`%c[${moment().format("DD-MM-YYYY HH:mm:ss")}] ~ [+] Connected to DB.`, "color: #2d8fb9");

		eventHandler(client);

		client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`Error: ${error}`);
	}
})();

