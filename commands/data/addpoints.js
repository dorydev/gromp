const {SlashCommandBuilder, EmbedBuilder, MessageFlags} = require('discord.js');
const User = require('../../models/User');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpoints')
        .setDescription('Ajouter des points à un utilisateur')
        //User Option
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to whom to add points')
                .setRequired(true))

        .addIntegerOption(option =>
            option.setName('points')
                .setDescription('The number of points to add')
                .setRequired(true)),
    defaultMemberPermissions: 0,
        
    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const points = interaction.options.getInteger('points');
        let dbUser = await User.findOne({ userId: user.id });

        if (!dbUser) {
            return interaction.reply({ content: 'User not found in the database.', ephemeral: true });
        }

        dbUser.xp += points;
        await dbUser.save();

        const embed = new EmbedBuilder()
            .setColor('#922b21')
            .setTitle('Points added')
            .setDescription(`Added ${points} points to ${user.username}.`)
            .addFields(
                { name: 'Total Points', value: `${dbUser.xp}`, inline: true },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        console.log(`--- [DEBUG] addpoints Execution Start ---`);
        console.log(`[SUCCESS] **Points added successfully.** - User: ${user.username}:(${user.id}) | Points: ${dbUser.xp})`);
    }
};