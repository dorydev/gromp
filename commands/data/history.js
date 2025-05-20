const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const History = require('../../models/History');
const moment = require('moment');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription("Display the history of the leaderboard")
		.addStringOption(option =>
			option.setName('identifiant')
				.setDescription("Identifier of the leaderboard")
				.setRequired(false)),

	async execute(interaction) {
		const tag = interaction.options.getString('identifiant');
		let entry;

		if (tag) {
			entry = await History.findOne({ tag });
			if (!entry) return interaction.reply({ content: "[ERROR] - No history found for this identifier.", ephemeral: true });
		} else {
			entry = await History.findOne().sort({ timestamp: -1 });
			if (!entry) return interaction.reply({ content: "[WARNING] - No history recorded at this time.", ephemeral: true });
		}

		let desc = '';
		for (const [rank, userId] of entry.data.entries()) {
			const user = await interaction.client.users.fetch(userId).catch(() => null);
			const username = user ? user.username : "Unknown User";
			desc += `**#${rank}** - <@${userId}> (\`${username}\`)\n`;
		}

		const embed = new EmbedBuilder()
			.setTitle(`History - (${entry.tag})`)
			.setColor('#A1866F')
			.setDescription(desc || "**No data to display**")
			.setFooter({ text: `Saved on ${moment(entry.timestamp).format('DD MMMM YYYY')}` });

		await interaction.reply({ embeds: [embed] });
	}
};
