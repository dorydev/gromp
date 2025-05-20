const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .addNumberOption( option =>
            option.setName("time")
            .setRequired(true)
        ),

    async exectute(clientn, interaction) {
        return;

        /**
         * - Stocke l'option dans la db
         * - Récupère l'option
         * - Set sur l'autoreset
         */

    }

};