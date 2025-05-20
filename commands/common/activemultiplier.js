const { SlashCommandBuilder } = require('discord.js');

let activeMultiplier = 1;
let multiplierTimeout;
let multiplierEndTime;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activemultiplier')
        .setDescription('Activate an XP multiplier')
        .addNumberOption(option =>
            option.setName('boost')
                .setDescription('Value of the multiplier (e.g., 2 for double XP)')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('duration')
                .setDescription('Duration of the multiplier in minutes')
                .setRequired(true)),

    execute: async (interaction) => {
        const boost = interaction.options.getNumber('boost');
        const duration = interaction.options.getNumber('duration');

        if (boost <= 0 || duration <= 0) {
            if (interaction.replied || interaction.deferred) {
                return interaction.followUp({
                    content: 'Boost and duration must be positive numbers.',
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: 'Boost and duration must be positive numbers.',
                    ephemeral: true
                });
            }
        }

        if (activeMultiplier > 1) {
            const remainingTime = Math.ceil((multiplierEndTime - Date.now()) / 60000);
            const message = `:x: **An XP multiplier is already active!** | Current multiplier: x${activeMultiplier} still active for ${remainingTime} minutes.`;

            if (interaction.replied || interaction.deferred) {
                return interaction.followUp({
                    content: message,
                    ephemeral: true
                });
            } else {
                return interaction.reply({
                    content: message,
                    ephemeral: true
                });
            }
        }

        activeMultiplier = boost;
        multiplierEndTime = Date.now() + duration * 60000;

        if (multiplierTimeout) {
            clearTimeout(multiplierTimeout);
        }

        multiplierTimeout = setTimeout(async () => {
            activeMultiplier = 1;
            multiplierEndTime = null;

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp('XP multiplier has ended.');
                } else {
                    await interaction.reply('XP multiplier has ended.');
                }
            } catch (err) {
                console.error('[ERROR] Error sending XP multiplier end message:', err);
            }
        }, duration * 60 * 1000);

        const activationMessage = `XP multiplier is now active: x${boost} for a duration of ${duration} minutes.`;

        if (interaction.replied || interaction.deferred) {
            return interaction.followUp({
                content: activationMessage,
                ephemeral: false
            });
        } else {
            return interaction.reply({
                content: activationMessage,
                ephemeral: false
            });
        }
    },

    getMultiplier: () => activeMultiplier
};