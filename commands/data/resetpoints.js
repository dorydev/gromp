const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const User = require('../../models/User');


module.exports = {

    data: new SlashCommandBuilder()
        .setName('resetpoints')
        .setDescription('Reset all points of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to reset points for')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.inGuild()) return;
        const resetUser = interaction.options.getUser('user');
            
        const user = await User.findOne({ userId: resetUser.id, guildId: interaction.guild.id });

        if (!user) return interaction.reply({content: "There's no user in the database"})
            
        try {
            user.xp = 0;

            await user.save();
            await interaction.reply({content: `User points have been reset`});
        } catch (error) {
            console.error("[ERROR] ", error);
            return interaction.reply({content: "An error occured while resetting user's points"})
        }
            
    }
}