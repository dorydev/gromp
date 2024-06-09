require('dotenv').config()
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('./config.json');
const fs = require("fs");
const path = require('path');

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

client.config = config;

//command handler

client.commands = new Collection();


(async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(process.env.MONGODB_URI);
		console.log(`%c[${moment().format("DD-MM-YYYY HH:mm:ss")}] ~ [+] Connected to DB.`, "color: #2d8fb9");
		console.log(`%c[${moment().format("DD-MM-YYYY HH:mm:ss")}] ~ [+] Online.`, "color: #2d8fb9");

		client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`Error: ${error}`);
	}
})();

