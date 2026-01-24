console.log("Bot initializing...");

const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');
const commands = require('./commands');
const events = require('./events');
const { logError } = require('./utils/errorLogger');
const util = require('util');

class Bot {
    constructor(channelSettings) {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
            ],
            partials: ['CHANNEL'], 
            ws: {
                properties: {
                    $os: 'Windows',
                    $browser: 'Discord Client',
                    $device: 'desktop',
                },
            },
        });

        this.rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN);
        this.channelSettings = channelSettings;
        this.userMessageHistory = {};
        this.ignoreTimes = {};
        this.setupEvents();
    }


    async start() {
        console.log("Starting...");
        try {
            await this.registerCommands();
            await this.client.login(config.DISCORD_TOKEN);
        } catch (error) {
            logError(`Error starting bot: ${error.message}`, {
                stack: error.stack,
                type: 'startup'
            });
            process.exit(1);
        }
    }

    async registerCommands() {
        try {
            const start = new Date();
            console.log('Registering commands with Discord...');
            await this.rest.put(Routes.applicationCommands(config.CLIENT_ID), { body: commands });
            console.log(`Successfully registered commands with Discord in ${new Date() - start} ms`);
        } catch (error) {
            logError(`Error registering commands: ${error.message}`, {
                stack: error.stack,
                type: 'command_registration'
            });
        }
    }

    setupEvents() {
        for (const event of Object.values(events)) {
            const execute = async (...args) => {
                try {
                    await event.execute(...args, this.client, this.channelSettings, this.userMessageHistory, this.ignoreTimes);
                } catch (error) {
                    logError(`Error in event ${event.name}: ${error.message}`, {
                        stack: error.stack,
                        type: 'event',
                        event: event.name,
                        args: util.inspect(args, { depth: 1, showHidden: false })
                    });
                }
            };
            if (event.once) {
                this.client.once(event.name, execute);
            } else {
                this.client.on(event.name, execute);
            }
        }

        this.client.on('warn', (warning) => {
            logError(`Client warning: ${warning}`, { type: 'warning' });
        });

        this.client.on('rateLimited', (info) => {
            logError(`Rate limited: ${JSON.stringify(info)}`, { type: 'rate_limit' });
        });
    }
}

module.exports = Bot;