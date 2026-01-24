const fetch = require('node-fetch');

module.exports = {
    name: 'import',
    description: 'Import a transcript file to restore your chat history',
    options: [
        {
            name: 'file',
            type: 11,
            description: 'The transcript JSON file exported by /history',
            required: true
        },
        {
            name: 'append',
            type: 5,
            description: 'Add to existing history or overwrite it',
            required: false
        }
    ],
    async execute(interaction, bot, channelSettings, userMessageHistory) {
        await interaction.deferReply();

        if (!interaction.guild) {
            return interaction.editReply({ content: ':no_entry: You cannot yet import transcripts into direct messages', ephemeral: false });   
        }

        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        const attachment = interaction.options.getAttachment('file');
        if (!attachment || !attachment.url) {
            return interaction.editReply({ content: ':x: You didn\'t attach a file!', ephemeral: false });
        }

        try {
            const res = await fetch(attachment.url, { timeout: 15000 });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                throw new Error('This is not JSON');
            }

            const fileUsername =
                (data && data.metadata && (data.metadata.user || data.metadata.username)) ||
                data?.user ||
                null;
            const invokerTag = interaction.user.tag;
            const invokerUsername = interaction.user.username;

            if (fileUsername && fileUsername !== invokerTag && fileUsername !== invokerUsername) {
                return interaction.editReply({
                    content: `:no_entry: This is not your chat\n-# Although you can be really petty and edit it to your liking...`,
                    ephemeral: false
                });
            }

            const normalize = (item) => {
                if (!item || typeof item !== 'object') return null;
                if (typeof item.user === 'string') return { role: 'user', content: item.user };
                if (typeof item.ai === 'string') return { role: 'assistant', content: item.ai };
                if (
                    (item.role === 'user' || item.role === 'assistant') &&
                    typeof item.content === 'string'
                ) return { role: item.role, content: item.content };
                return null;
            };

            let imported = [];
            if (Array.isArray(data?.messages)) {
                imported = data.messages.map(normalize).filter(Boolean);
            } else if (Array.isArray(data)) {
                imported = data.map(normalize).filter(Boolean);
            } else {
                throw new Error('This is not a pigeon transcript');
            }

            if (imported.length === 0) {
                return interaction.editReply({ content: ':x: This is not a pigeon transcript or has no messages', ephemeral: false });
            }

            const sanitized = imported
                .map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
                .slice(-200);

            const append = interaction.options.getBoolean('append');

            if (!userMessageHistory[guildId]) userMessageHistory[guildId] = {};
            if (!append) userMessageHistory[guildId][userId] = [];
            if (!userMessageHistory[guildId][userId]) userMessageHistory[guildId][userId] = [];

            const combined = append
                ? [...userMessageHistory[guildId][userId], ...sanitized]
                : sanitized;

            userMessageHistory[guildId][userId] = combined.slice(-200);

            await interaction.editReply({
                content: `:white_check_mark: Done! ${sanitized.length} messages${append ? ' appended!' : 'imported!'} Your history now has ${userMessageHistory[guildId][userId].length} messages`,
                ephemeral: false
            });
        } catch (e) {
            console.error(e);
            await interaction.editReply({ content: `:x: Import failed`, ephemeral: false });
        }
    }
};
