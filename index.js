require('dotenv').config()
const { Client, GatewayIntentBits, Events, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

client.config = config;

//command handler

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const folder of fs.readdirSync(commandsPath)) {
	if (fs.statSync(path.join(commandsPath, folder)).isDirectory()) {
		const subCommandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));
		for (const file of subCommandFiles) {
			const filePath = path.join(commandsPath, folder, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//fin command handler


const commandsArray = client.commands.map(cmd => cmd.data.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commandsArray.length} application (/) commands.`);

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsArray },
        );

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();


const autoReset = require('./events/autoReset')(client);
const logSender = require('./events/logSender');
logSender(client);

const giveUserXp = require('./events/giveUserXp');


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

