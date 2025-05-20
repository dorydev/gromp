const { Client, GatewayIntentBits, Events, Collection, REST, Routes, MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
      	if (!interaction.isCommand()) return;
  
      	const command = interaction.client.commands.get(interaction.commandName);
  
      	if (!command) {
        	console.error(`No command matching ${interaction.commandName} was found.`);
        	return;
      	}	
  
	  	try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.deferred || interaction.replied) {
				await interaction.followUp({ content: '[ERROR] An error occurred.', flags: MessageFlags.Ephemeral });
			} else {
				await interaction.reply({ content: '[ERROR] An error occurred.', flags: MessageFlags.Ephemeral });

			}
		}
	
    },
  };