require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

const logDir = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDir, 'errors.log');

async function initializeLogDirectory() {
    try {
        await fs.mkdir(logDir, { recursive: true });
        return true;
    } catch (error) {
        console.error(`Failed to create log directory ${logDir}: ${error.message}`);
        return false;
    }
}

async function sendWebhook(message, context) {
    const webhookUrl = 'https://discord.com/api/webhooks/1418489616796881006/'+process.env.HOOK;
    const embed = {
        author: {
            name: `${context.username || 'Unknown User'} (${context.userId || 'N/A'}) | ${context.guildName || 'Unknown Guild'} | ${context.guildId || 'N/A'}`
        },
        description: message,
        fields: [
            {
                name: 'msg',
                value: context.message || 'No message provided',
                inline: false
            },
            {
                name: 'jump 2 msg',
                value: context.messageUrl || 'No URL provided',
                inline: false
            },
            {
                name: 'jump 2 channel',
                value: context.channelUrl || 'No URL provided',
                inline: false
            }
        ],
        footer: {
            text: new Date().toISOString()
        }
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (!response.ok) {
            throw new Error(`HTTP error, status: ${response.status}`);
        }
    } catch (e) {
        console.error(e);
    }
}

async function logError(message, context = {}) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n` +
        (context.stack ? `Stack: ${context.stack}\n` : '') +
        (context.type ? `Type: ${context.type}\n` : '') +
        (context.userId ? `User: ${context.userId}\n` : '') +
        (context.guildId ? `Guild: ${context.guildId}\n` : '') +
        (context.command ? `Command: ${context.command}\n` : '') +
        (context.event ? `Event: ${context.event}\n` : '') +
        '---\n';

    console.error(logMessage);

    try {
        const canWrite = await initializeLogDirectory();
        if (canWrite) {
            await fs.appendFile(logFilePath, logMessage);
        } else {
            console.warn(`Skip!`);
        }
    } catch (e) {
        console.error(e);
    }

    await sendWebhook(message, context);
}

module.exports = { logError };