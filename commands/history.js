require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const { addClear } = require('../utils');

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY
    }
});

function generateRandomFilename() {
    return crypto.randomBytes(5).toString('hex');
}

module.exports = {
    name: 'history',
    description: 'Get a transcript of your chat',
    options: [
        {
            name: 'clear',
            type: 5,
            description: 'Clear the history after sending',
            required: false
        }
    ],
    async execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes) {
        await interaction.deferReply();

        const isDM = !interaction.guild;
        const guildId = interaction.guildId;
        const userId = interaction.user.id;

        const historyKey = isDM ? `dm-${userId}` : guildId;

        if (
            !userMessageHistory[historyKey] ||
            !userMessageHistory[historyKey][userId] ||
            userMessageHistory[historyKey][userId].length === 0
        ) {
            return interaction.editReply({ content: ':x: You have no history', ephemeral: false });
        }

        try {
            const history = userMessageHistory[historyKey][userId];

            const transcript2 = history
                .filter(entry => entry && typeof entry === 'object' && entry.role && entry.content)
                .map(entry => {
                    if (entry.role === 'user') {
                        return { user: entry.content };
                    } else if (entry.role === 'assistant') {
                        return { ai: entry.content };
                    }
                    return null;
                })
                .filter(entry => entry);

            const filename = generateRandomFilename();
            const payload = JSON.stringify({
                metadata: {
                    user: interaction.user.tag,
                    guild: isDM ? 'DM' : interaction.guild.name,
                    guildId: isDM ? '0' : interaction.guild.id,
                    type: isDM ? 'dm' : 'guild',
                    messageCount: transcript2.length,
                    created: Math.floor(Date.now() / 1000)
                },
                messages: transcript2
            }, null, 2);

            const uploadParams = {
                Bucket: 'pigeon-transcripts',
                Key: `${filename}.json`,
                Body: payload,
                ContentType: 'application/json'
            };

            await s3Client.send(new PutObjectCommand(uploadParams));

            const fileUrl = `https://pigeon.exerinity.com/view?chat=${filename}`;

            const clearHistory = interaction.options.getBoolean('clear');
            if (clearHistory) {
                delete userMessageHistory[historyKey][userId];
                addClear(userId);
                await interaction.editReply({
                    content: `:white_check_mark: A transcript of your chat can be found at ${fileUrl} - this will delete after 3 days - messages cleared.\n-# Anyone with a link to this can see your messages within this chat${isDM ? '' : ' and basic information about this server'}.`,
                    ephemeral: false
                });
            } else {
                await interaction.editReply({
                    content: `:white_check_mark: A transcript of your chat can be found at ${fileUrl} - this will delete after 3 days.\n-# Anyone with a link to this can see your messages within this chat${isDM ? '' : ' and basic information about this server'}.`,
                    ephemeral: false
                });
            }
        } catch (e) {
            console.error(e);
            await interaction.editReply({ content: ':x: Could not process history', ephemeral: false });
        }
    }
};