const { Client, GatewayIntentBits } = require("discord.js");
const {
  token,
  targetChannel,
  voiceChannelId,
  guildId,
} = require("./config.json");

const fsPromise = require("fs/promises");
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
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
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

      await voiceTTSToChannelId("Fucking promises how do they work", "391598293672656896", client);
      // 108255954268614656 is Collin
    
      //findChannelWithMemberId("108255954268614660", client);
      await interaction.reply("Worked");

    }
  }
});

function findChannelWithMemberId(memberId, client) {
   const guild = client.guilds.cache.get(guildId);

  for (const [channelId, channel] of guild.channels.cache) {
    if (channel.type === 2) {
      console.log(channel.name);
      console.log(channel.members);
    }
  }
}


function voiceTTSToChannelWithMember(msg, memberName, client) {

}

async function voiceTTSToChannelId(msg, channelId, client) {
  let player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });

  player.on(AudioPlayerStatus.Idle, async (oldState, newState) => {
    console.log("Audio completed playing");
    await fsPromise.unlink(path.format(inFilePath));
    subscription.unsubscribe();
    connection.destroy();
  });

  player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
    console.log("Audio Playing");
  });

  const guild = client.guilds.cache.get(guildId);
  const inFilePath = path.parse('./tmp.wav');
  await espeak.speakToFile(msg, inFilePath);
  const resource = createAudioResource(path.join(__dirname, path.format(inFilePath)), {
    inlineVolume: true,
  });

  let connection = joinVoiceChannel({
    channelId: channelId,
    guildId: guildId,
    adapterCreator: guild.voiceAdapterCreator 
  });

  connection.on(VoiceConnectionStatus.Ready, async (oldState, newState) => {
    console.log("Voice Connection Ready!");
    player.play(resource);
    console.log(`Unlinked ${path.format(inFilePath)}`);
    subscription = connection.subscribe(player);
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
}