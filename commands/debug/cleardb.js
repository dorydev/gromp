const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleardb')
		.setDescription('Clear the database of all users')
		.setDefaultMemberPermissions(0),

	async execute(interaction) {
		const isOwner = interaction.user.id === interaction.guild.ownerId;

		if (!isOwner) {
			return interaction.reply({ content: '[ERROR] You do not have permission to use this command.', ephemeral: true });
		}

		try {
			await interaction.deferReply({ ephemeral: true });

			const count = await User.countDocuments();
			await User.deleteMany({});

			await interaction.editReply(`[SUCCESS] Database cleared. **${count} users** deleted.`);
		} catch (error) {
			console.error('Error clearing DB:', error);
			if (!interaction.replied && !interaction.deferred) {
				return interaction.reply({ content: '[ERROR] An error occurred.', ephemeral: true });
			}
			return interaction.followUp({ content: '[ERROR] An error occurred.', ephemeral: true });
		}
	},
};
