console.log(`pigeon - starting...`);

const start = new Date();

const Bot = require('./bot');
const { startServer } = require('./server');
const fs = require('fs');
const config = require('./config');
const { logError } = require('./utils/errorLogger');

console.log("Initializing...");

async function main() {
    let channelSettings = {};
    try {
        if (fs.existsSync(config.DATA_FILE)) {
            channelSettings = JSON.parse(fs.readFileSync(config.DATA_FILE));
            console.log("Settings loaded!");
        }
    } catch (error) {
        logError(`Error loading channel settings: ${error.message}`, {
            stack: error.stack,
            type: 'startup'
        });
    }

    const bot = new Bot(channelSettings);
    await bot.start();
    startServer();
    console.log(`All services started in ${new Date() - start} ms!`);
}

process.on('unhandledRejection', (reason, promise) => {
    logError(`Unhandled promise rejection: ${reason}`, {
        stack: reason.stack || '',
        type: 'unhandled_rejection',
        promise
    });
});

process.on('uncaughtException', (error) => {
    logError(`Uncaught exception: ${error.message}`, {
        stack: error.stack,
        type: 'uncaught_exception'
    });
    if (error.message.includes('ENOMEM') || error.message.includes('EADDRINUSE')) {
        console.error('!!! A critical error occured that cannot be handled, exiting !!!');
        process.exit(1);
    }
});

main().catch(error => {
    logError(`Main process error: ${error.message}`, {
        stack: error.stack,
        type: 'main'
    });
    process.exit(1);
});