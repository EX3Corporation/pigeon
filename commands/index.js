const about = require('./about');
const chat = require('./chat');
const clearhistory = require('./clearhistory');
const history = require('./history');
const ignore = require('./ignore');
const invite = require('./invite');
const privacy = require('./privacy');
const remove = require('./remove');
const restart = require('./restart');
const stats = require('./stats');
const uptime = require('./uptime');
const unignore = require('./unignore');
const usage = require('./usage')
const { logError } = require('../utils/errorLogger');
const imp = require('./import');

const commands = [
    about,
    chat,
    clearhistory,
    history,
    ignore,
    invite,
    privacy,
    remove,
    restart,
    stats,
    uptime,
    unignore,
    usage,
    imp
];

module.exports = commands;

module.exports.execute = async (interaction, bot, channelSettings, userMessageHistory, ignoreTimes) => {
    if (!interaction.isCommand()) return;

    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes);
        } catch (e) {
            logError(`ERR: ${command.name}: ${e.message}`, {
                stack: e.stack,
                type: 'command',
                command: command.name,
                userId: interaction.user.id,
                guildId: interaction.guildId
            });
            try {
                await interaction.reply({
                    content: ":x: Something went wrong executing that command:\n```"+e.message+"```\nUsually, running the command again might work. If not, [please report it](<https://exerinity.com/contact>)",
                    ephemeral: true
                });
            } catch (replyError) {
                logError(`FAIL NOTICE: ${replyError.message}`, {
                    stack: replyError.stack,
                    type: 'command_reply',
                    userId: interaction.user.id,
                    guildId: interaction.guildId
                });
            }
        }
    }
};