const { Client, GatewayIntentBits } = require('discord.js');
const { token, targetChannel } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Login to Discord with your client's token
client.login(token);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, channelId } = interaction;

    if (channelId === targetChannel) {
        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        } else if (commandName === 'pong') {
            await interaction.reply('Segmentation Fault (Core Dumped!)');
        }
    }
});

