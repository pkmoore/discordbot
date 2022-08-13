const { Client, GatewayIntentBits } = require('discord.js');
const { token, targetChannel, voiceChannelId, guildId } = require('./config.json');

const { createReadStream } = require('node:fs');
const { join } = require('node:path');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

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
            await interaction.reply('Segmentation Fault (Core Dumped?)');
        } else if (commandName === 'boop') {
            
            const guild = client.guilds.cache.get(guildId);

            let player = createAudioPlayer({
              behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
              },
            });

            player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
                console.log("Audio completed playing")
                subscription.unsubscribe();
                connection.destroy();
            });

            player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
                console.log("Audio Playing");
            });

            const resource = createAudiResource(join(__dirname, 'test.mp3'), { inlineVolume: true });

            let connection = await joinVoiceChannel({
                channelId: voiceChannelId,
                guildId: guildId,
                adapterCreator: guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Destroyed, (oldState, newState) => {
                console.log("Voice connection destroyed");
            });

            connection.on(VoiceConnectionStatus.Disconnected, (oldState, newState) => {
                console.log("Voice connection destroyed");
            });

            connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
                console.log("Voice Connection Ready!");
                player.play(resource);
                subscription = connection.subscribe(player);
            });

            //await interaction.reply('Booped Mark\'s Cabin');
        }
    }
});

