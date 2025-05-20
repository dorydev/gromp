const User = require('../models/User');
const messageCounter = new Map();
const cooldowns = new Map();
const { getMultiplier } = require('../commands/common/activemultiplier');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = {
	name: 'giveUserXp',

	async execute(client, message) {
		if (!message.inGuild() || message.author.bot) return;

		const now = new Date();
		const timestamp = now.toLocaleString('fr-FR', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});

		const userId = message.author.id;
		const guildId = message.guild.id;
		const key = `${userId}-${guildId}`;

		// Buffer pour tous les logs de cette exécution
		const logs = [];
		const prefix = `:: ${timestamp} -`;

		// Start of the process
		logs.push(`[DEBUG] ${prefix} start giveUserXp`);
		logs.push(`[INFO] ${prefix} User message: "${message.content}" from ${message.author.tag}`);

		const cooldown = cooldowns.get(key) || 0;
		if (now.getTime() < cooldown) {
			logs.push(`[WARNING] ${prefix} User is on cooldown until ${new Date(cooldown).toLocaleString('fr-FR')}`);
			logs.push(`[DEBUG] ${prefix} end giveUserXp`);
			console.log(logs.join('\n'));
			return;
		}

		// Incrément du compteur de messages
		const count = messageCounter.get(key) || 0;
		messageCounter.set(key, count + 1);
		logs.push(`[INFO] ${prefix} Compteur de messages pour l'utilisateur: ${count + 1}`);

		try {
			let user = await User.findOne({ userId, guildId });
			if (!user) {
				user = new User({ userId, guildId, xp: 0, messages: 1 });
				logs.push(`[INFO] ${prefix} Création d'un nouvel utilisateur dans la base de données`);
			} else {
				user.messages += 1;
			}

			// Attribution d'XP tous les 5 messages
			if (messageCounter.get(key) >= 5) {
				messageCounter.set(key, 0);
				cooldowns.set(key, now.getTime() + 60_000);
				const multiplier = getMultiplier();
				const xpGained = 1 * multiplier;
				user.xp += xpGained;

				logs.push(`[INFO] ${prefix} Attribution d'XP :`);
				logs.push(`[INFO] ${prefix} → Voyageur : ${message.author.tag} (${message.author.id})`);
				logs.push(`[INFO] ${prefix} → Sanctuaire : ${message.guild.name} (${message.guild.id})`);
				logs.push(`[INFO] ${prefix} → Points gagnés : ${xpGained} (Multiplicateur: x${multiplier})`);
			} else {
				logs.push(`[INFO] ${prefix} ${5 - messageCounter.get(key)} messages restants avant la prochaine attribution d'XP`);

				console.log(`Encore ${5 - messageCounter.get(key)} messages avant la prochaine bénédiction d'XP.`);

			}

			await user.save();
			logs.push(`[SUCCESS] ${prefix} Données utilisateur sauvegardées avec succès`);
		} catch (err) {
			logs.push(`[ERROR] ${prefix} Erreur lors du traitement de l'XP: ${err.message}`);
			console.log(logs.join('\n'));
			return;
		}

		logs.push(`[DEBUG] ${prefix} Fin de l'exécution de giveUserXp`);
		console.log(logs.join('\n'));
	},
};
