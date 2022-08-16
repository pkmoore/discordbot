const { Client, GatewayIntentBits } = require("discord.js");
const {
  token,
  targetChannel,
  voiceChannelId,
  guildId,
} = require("./config.json");

const fs = require("node:fs");
const path = require("node:path");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");


const espeak = require('./espeaktts.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Login to Discord with your client's token
client.login(token);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, channelId } = interaction;

  if (channelId === targetChannel) {
    if (commandName === "ping") {
      await interaction.reply("Pong!");
    } else if (commandName === "pong") {
      await interaction.reply("Segmentation Fault (Core Dumped?)");
    } else if (commandName === "boop") {
      const guild = client.guilds.cache.get(guildId);

      const inFilePath = espeak.speakToFile('Hello Collin');

      let player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Pause,
        },
      });

      player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
        console.log("Audio completed playing");
        subscription.unsubscribe();
        connection.destroy();
        fs.unlink(path.format(inFilePath), (err) => {
            if (err) {
                throw err
            } else {
                console.log(`Unlinked ${path.format(inFilePath)}`);
            }
        });
      });

      player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
        console.log("Audio Playing");
      });

      const resource = createAudioResource(path.join(__dirname, path.format(inFilePath)), {
        inlineVolume: true,
      });

      let connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guildId,
        adapterCreator: guild.voiceAdapterCreator,
      });

      connection.on(VoiceConnectionStatus.Destroyed, (oldState, newState) => {
        console.log("Voice connection destroyed");
      });

      connection.on(
        VoiceConnectionStatus.Disconnected,
        (oldState, newState) => {
          console.log("Voice connection destroyed");
        }
      );

      connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
        console.log("Voice Connection Ready!");
        player.play(resource);
        subscription = connection.subscribe(player);
      });

      await interaction.reply('Message sent');
    }
  }
});
