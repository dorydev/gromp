const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User');
const History = require('../../models/History');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autosave')
		.setDescription('Manually save the current XP leaderboard to the database and reset all users\' XP.'),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const now = new Date();
		const tag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

		const alreadyExists = await History.findOne({ tag });
		if (alreadyExists) {
			return interaction.editReply(`[ERROR] The leaderboard \`${tag}\` is already saved.`);
		}

		const users = await User.find({}).sort({ xp: -1 }).limit(10);
		if (!users.length) {
			return interaction.editReply(`[WARNING] No user with XP to save.`);
		}

		const topData = {};
		for (let i = 0; i < users.length; i++) {
			topData[i + 1] = users[i].userId;
		}

		await History.create({
			tag,
			data: topData
		});

		const allUsers = await User.find({});
		for (const user of allUsers) {
			user.xp = 0;
			await user.save();
		}
		return interaction.editReply(`[SUCCESS] The leaderboard \`${tag}\` has been successfully saved. Points reset.`);
	}
};
