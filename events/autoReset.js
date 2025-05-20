const User = require('../models/User');
const History = require('../models/History');
const cron = require('node-cron');

module.exports = (client) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const cronExpr = isDev ? '*/2 * * * *' : '0 0 1 * *'; 

    cron.schedule(cronExpr, async () => {
        const now = new Date();
        const tag = ` ${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
        const existing = await History.findOne({ tag });
        if (existing) return console.log(`[AUTO-RESET] Ranking ${tag} already saved.`);

        const users = await User.find({}).sort({ xp: -1 }).limit(10);
        if (!users.length) return console.log("[WARNING] No user to save.");

        const topData = {};
        for (let i = 0; i < users.length; i++) {
            topData[i + 1] = users[i].userId;
        }

        await History.create({
            tag,
            data: topData
        });
        for (const user of await User.find({})) {
            user.xp = 0;
            await user.save();
        }
        console.log(`[AUTO-RESET] Top 10 saved under ${tag}, points reset.`);
    })
};