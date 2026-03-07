const { inspect } = require('util');

const OWNER_IDS = new Set([
    '972907501127344179',
    '683100147512770602'
]);

const SENSITIVE_VALUES = [
    process.env.TOKEN,
    process.env.CLIENT_ID,
    process.env.API_KEY,
    process.env.CF_ID
].filter(Boolean);

const MAX_RESPONSE_LENGTH = 1900;

function clean(text) {
    if (typeof text !== 'string') {
        return text;
    }

    return text
        .replace(/`/g, '`\u200b')
        .replace(/@/g, '@\u200b');
}

function sanitizeSecrets(text) {
    let sanitized = text;
    for (const value of SENSITIVE_VALUES) {
        sanitized = sanitized.split(value).join('[redacted]');
    }
    return sanitized;
}

function formatResult(value) {
    if (typeof value === 'string') {
        return value;
    }

    return inspect(value, {
        depth: 1,
        maxArrayLength: 50,
        breakLength: 80
    });
}

function truncate(text) {
    if (text.length <= MAX_RESPONSE_LENGTH) {
        return text;
    }

    return `${text.slice(0, MAX_RESPONSE_LENGTH)}...`;
}

function buildBlock(prefix, body, language = 'js') {
    return `${prefix}\n\`\`\`${language}\n${body}\n\`\`\``;
}

module.exports = {
    name: 'eval',
    description: 'Evaluate JavaScript',
    options: [
        {
            name: 'code',
            type: 3,
            description: 'The code to evaluate',
            required: true
        }
    ],
    async execute(interaction, bot) {
        if (!OWNER_IDS.has(interaction.user.id)) {
            return interaction.reply({
                content: 'no',
                ephemeral: true
            });
        }

        const code = interaction.options.getString('code', true);
        await interaction.deferReply({ ephemeral: true });

        try {
            let result = await eval(code);
            if (typeof result === 'undefined') {
                result = 'undefined';
            }

            let output = formatResult(result);
            output = sanitizeSecrets(clean(String(output)));
            output = truncate(output.length ? output : 'No output');

            await interaction.editReply({
                content: buildBlock(output)
            });
        } catch (error) {
            let errorOutput = error instanceof Error ? error.stack || error.message : String(error);
            errorOutput = sanitizeSecrets(clean(errorOutput));
            errorOutput = truncate(errorOutput);

            await interaction.editReply({
                content: buildBlock(':x: Error', errorOutput, 'txt')
            });
        }
    }
};
