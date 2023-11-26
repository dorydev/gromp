const moment = require('moment');
const {ActivityType} = require('discord.js');

module.exports = (client) => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ~ [+] ${client.user.tag} is online.`);
	client.user.setActivity({
		name: "root@user:~$ cd src/commands/hello.js",	
		type: ActivityType.Playing,
	})
};
