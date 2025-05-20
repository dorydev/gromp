const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const User = require('../../models/User.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailyreset')
        .setDescription('Delete all daily rewards')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to reset daily')
        ), 
    async execute(interaction) {

    }

}