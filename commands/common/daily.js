const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

const dailyXpAmount = 5;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your daily XP points!'),

	execute: async (interaction) => {
		const client = interaction.client;
		const errorChannel = process.env.LOG_CHANNEL_ID
			? await client.channels.fetch(process.env.LOG_CHANNEL_ID)
			: null;

		if (!interaction.inGuild()) {
			return interaction.reply({
				content: '[WARNING] - This command can only be used in a server.',
				ephemeral: true,
			});
		}

		try {
			await interaction.deferReply();

			const query = {
				userId: interaction.user.id,
				guildId: interaction.guild.id,
			};

			let user = await User.findOne(query);

			if (user) {
				const lastDailyDate = user.lastDaily?.toDateString();
				const currentDate = new Date().toDateString();

				if (lastDailyDate === currentDate) {
					return interaction.editReply(
						'[WARNING] - You have already claimed your daily points today. Please come back tomorrow.',
					);
				}

				user.lastDaily = new Date();
				user.xp += dailyXpAmount;

			} else {
				user = new User({
					...query,
					lastDaily: new Date(),
					xp: dailyXpAmount,
				});
			}

			await user.save();

			interaction.reply(`You have received **${dailyXpAmount}** points!` );

		} catch (error) {
			console.error(error);
			if (errorChannel) {
				errorChannel.send(`[ERROR] Error in /daily : \`\`\`fix\n${error}\`\`\``);
			}
			interaction.editReply("[ERROR] An error occurred while processing your request. Please try again later.");
		}
	},
};
