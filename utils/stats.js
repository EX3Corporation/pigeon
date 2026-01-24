const fs = require('fs');
const path = require('path');
const config = require('../config');

const statsFilePath = path.join(__dirname, '../', config.STAT_FILE);

function loadStats() {
    if (fs.existsSync(statsFilePath)) {
        const data = fs.readFileSync(statsFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return {};
}

function saveStats(stats) {
    fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
}

function addMessage(userId) {
    const stats = loadStats();
    if (!stats[userId]) {
        stats[userId] = { messages: 0, clears: 0 };
    }
    stats[userId].messages += 1;
    saveStats(stats);
}

function addClear(userId) {
    const stats = loadStats();
    if (!stats[userId]) {
        stats[userId] = { messages: 0, clears: 0 };
    }
    stats[userId].clears += 1;
    saveStats(stats);
}

module.exports = { loadStats, addMessage, addClear };