module.exports = {
    name: 'ignore',
    description: 'Ignore user',
    options: [
        {
            name: 'for',
            type: 3,
            description: 'How long to ignore the user for',
            required: true,
            choices: [
                { name: '15 seconds', value: '15s' },
                { name: '30 seconds', value: '30s' },
                { name: '1 minute', value: '60s' },
                { name: '2 minutes', value: '120s' },
                { name: '5 minutes', value: '300s' },
                { name: '10 minutes', value: '600s' },
                { name: '20 minutes', value: '1200s' },
                { name: '1 hour', value: '3600s' }
            ]
        }
    ],
    async execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes) {
        const userId = interaction.user.id;

        if (ignoreTimes[userId] && Date.now() < ignoreTimes[userId]) {
            const unixTimestamp = Math.floor(ignoreTimes[userId] / 1000);
            return interaction.reply({ content: `I'm already ignoring you until <t:${unixTimestamp}:T>!`, ephemeral: true });
        }

        const duration = interaction.options.getString('for');
        if (!duration) {
            return interaction.reply({ content: ':x: Invalid duration!', ephemeral: true });
        }

        let ignoreDuration;
        switch (duration) {
            case '15s': ignoreDuration = 15 * 1000; break;
            case '30s': ignoreDuration = 30 * 1000; break;
            case '60s': ignoreDuration = 60 * 1000; break;
            case '120s': ignoreDuration = 120 * 1000; break;
            case '300s': ignoreDuration = 300 * 1000; break;
            case '600s': ignoreDuration = 600 * 1000; break;
            case '1200s': ignoreDuration = 1200 * 1000; break;
            case '3600s': ignoreDuration = 3600 * 1000; break;
            default:
                return interaction.reply({ content: ':x: Invalid duration, how did you even do this?', ephemeral: true });
        }


        try {
            ignoreTimes[userId] = Date.now() + ignoreDuration;
            const unixTimestamp = Math.floor(ignoreTimes[userId] / 1000);

            await interaction.reply({
                content: `:white_check_mark: I will ignore **you** for ${duration} - messages continue <t:${unixTimestamp}:R>`,
                ephemeral: false
            });

            setTimeout(async () => {
                try {
                    if (!ignoreTimes[userId] || Date.now() < ignoreTimes[userId]) {
                        return;
                    }

                    await interaction.followUp({
                        content: `<@${interaction.user.id}> I am no longer ignoring you`,
                        ephemeral: false
                    });

                    delete ignoreTimes[userId];
                } catch (error) {
                    null; // who cares, it expired
                }
            }, ignoreDuration);

        } catch (e) {
            console.error(e);
            await interaction.reply({ content: ':x: Couldn\'t set ignore', ephemeral: true });
        }
    }
};