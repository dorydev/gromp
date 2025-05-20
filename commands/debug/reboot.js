const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reboot')
        .setDescription('Reboot the bot')
        .setDefaultMemberPermissions(0),

    async execute(interaction) {
        const confirmButton = new ButtonBuilder()
            .setCustomId('confirm-reboot')
            .setLabel('Confirmer')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel-reboot')
            .setLabel('Stop')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        await interaction.reply({
            content: 'Are you sure you want to reboot the bot?',
            components: [row],
            ephemeral: true,
        });

        const filter = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'confirm-reboot') {
                await i.update({ content: 'Rebooting...', components: [] });
                process.exit(0);
            } else if (i.customId === 'cancel-reboot') {
                await i.update({ content: 'Reboot canceled.', components: [] });
            }
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                await interaction.editReply({ content: 'No response received, reboot canceled.', components: [] });
            }
        });
    },
};
