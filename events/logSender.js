const { Client } = require('discord.js');

module.exports = (client) => {
	const originalConsoleLog = console.log;

	let discordLoggingEnabled = false;

	const logStyles = {
		'[READY]': 'diff',
		'[INFO]': 'fix',
		'[DEBUG]': 'css',
		'[WARNING]': 'diff',
		'[ERROR]': 'diff',
		'[CRITICAL]': 'diff',
		'[SUCCESS]': 'diff',
		'[MESSAGE]': 'md',
		'[COMMAND]': 'ini',
		'[EVENT]': 'yaml',
		'[INTERACTION]': 'bash',
	};

	const formatSymbol = (type) => {
		if (type.includes('[ERROR]') || type.includes('[CRITICAL]')) return '-';
		if (type.includes('[SUCCESS]') || type.includes('[READY]')) return '+';
		if (type.includes('[WARNING]')) return '!';
		return '•';
	};

	const getTime = () => {
		const now = new Date();
		return now.toTimeString().split(' ')[0]; // Format: HH:MM:SS
	};

	console.log = async function (...args) {
		originalConsoleLog.apply(console, args);

		if (!discordLoggingEnabled) return; // N'envoie pas sur Discord tant que le client n'est pas prêt

		try {
			const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
			if (!logChannel) return;

			const rawMessage = args.map(arg =>
				typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
			).join(' ');

			// Détection du type de log
			const logType = Object.keys(logStyles).find(t => rawMessage.includes(t)) || '[INFO]';
			const style = logStyles[logType] || 'fix';
			const prefix = formatSymbol(logType);
			const timestamp = getTime();

			const cleanedMessage = rawMessage.replace(logType, '').trim();

			const finalLog = `${prefix} ${logType} :: ${timestamp} - ${cleanedMessage}`;
			const content = `\`\`\`${style}\n${finalLog}\n\`\`\``;

			logChannel.send({ content });
		} catch (error) {
			originalConsoleLog('[ERROR] Error sending log to Discord channel:', error);
		}
	};

	client.once('ready', async () => {
		discordLoggingEnabled = true;
		try {
			const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
			if (logChannel) {
				const time = getTime();
				logChannel.send(`\`\`\`diff\n+ [READY] :: ${time} - Bot is now online\n\`\`\``);
			}
		} catch (error) {
			originalConsoleLog('[ERROR] Error sending startup message:', error);
		}
	});
};
