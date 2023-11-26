const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

const forceCleanRegister = false; //FOR DEBUGGING
const purgeOldCommands = false;   //FOR DEBUGGING

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

      if(purgeOldCommands) {
          const commandsToPurge = await applicationCommands.fetch();
          commandsToPurge.each(command => {
              applicationCommands.delete(command.id);
              console.log(`🗑 Purged command "${command.name}".`);
          });
      }

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = (forceCleanRegister ? false : await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      ));

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`🗑 Deleted command "${name}".`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          /*await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });*/

            await applicationCommands.edit(existingCommand.id, localCommand)

          console.log(`🔁 Edited command "${name}".`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `⏩ Skipping registering command "${name}" as it's set to delete.`
          );
          continue;
        }

        /*await applicationCommands.create({
          name,
          description,
          options,
        });*/

        await applicationCommands.create(localCommand)

        console.log(`👍 Registered command "${name}"`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
