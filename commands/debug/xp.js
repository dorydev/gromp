const { SlashCommandBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
		.setDescription('Vérifiez votre XP'),

	/**
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	execute: async (interaction) => {
		if (!interaction.inGuild()) {
			if (interaction.replied || interaction.deferred) {
				return interaction.followUp({
					content: 'Cette commande ne peut être utilisée que dans un serveur.',
					ephemeral: true
				});
			} else {
				return interaction.reply({
					content: 'Cette commande ne peut être utilisée que dans un serveur.',
					ephemeral: true
				});
			}
		}

		try {
			const userId = interaction.user.id;
			const guildId = interaction.guild.id;
			const user = await User.findOne({ userId, guildId });

			if (!user) {
				if (interaction.replied || interaction.deferred) {
					return interaction.followUp({
						content: "Vous n'avez pas encore d'XP.",
						ephemeral: true
					});
				} else {
					return interaction.reply({
						content: "Vous n'avez pas encore d'XP.",
						ephemeral: true
					});
				}
			}

			const resultMessage = `:scroll: **Voyageur, voici ton aura dans le Sanctuaire :**

:star2: XP Total : **${user.xp}**
:speech_balloon: Messages envoyés : **${user.messages}**

:cherry_blossom: *Continue ton voyage pour gravir les sommets de la brume...*`;

			if (interaction.deferred) {
				return interaction.editReply({ content: resultMessage });
			} else {
				return interaction.reply({ content: resultMessage });
			}

		} catch (err) {
			console.error('Erreur dans /xp :', err);
			if (interaction.replied || interaction.deferred) {
				return interaction.followUp({
					content: 'Une erreur est survenue lors de la récupération de votre XP.',
					ephemeral: true
				});
			} else {
				return interaction.reply({
					content: 'Une erreur est survenue lors de la récupération de votre XP.',
					ephemeral: true
				});
			}
		}
	}
};