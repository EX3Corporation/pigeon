require('dotenv').config();
const fs = require('fs');
console.log("Configuration initializing...");

module.exports = {
    DISCORD_TOKEN: process.env.TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    DATA_FILE: 'data/data.json',
    STAT_FILE: 'data/stats.json',
    CF_ID: process.env.CF_ID,
    API_KEY: process.env.API_KEY,
};