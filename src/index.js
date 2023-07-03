const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ], partials: [Partials.User, Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.on("ready", (c) => {
  console.log("The bot is ready");
});

client.on("messageCreate", async (message) => {
  let channels = [];

  if (message.content === "!breakout") {
    const modRole = message.guild.roles.cache.find(
      (role) => role.name === "Mod"
    );

    if (
      message.member.permissions.has("MANAGE_CHANNELS") ||
      (modRole && message.member.roles.cache.has(modRole.id)) ||
      message.member.id === message.guild.ownerId
    ) {
      for (let i = 1; i <= 3; i++) {
        const channel = await message.guild.channels.create({
          name: `Breakout-${i}`,
          type: 2,
          parent: message.channel.parentId,
        });
        channels.push(channel);
      }

      message.reply("Created 3 breakout channels!");
    } else {
      message.reply("You don't have permission to create channels.");
    }

    const interactionChannel = message.channel;
    const category = interactionChannel.parent;

    const userChannel = Array.from(category.children.cache.values()).find(
      ({ name }) => name.includes("general")
    );

    const usersInLobby = Array.from(userChannel.members.values());

    let filtered = usersInLobby.filter((user) => {
      return user.user.bot === false;
    });

    await filtered.forEach((user) => {
      let count = 0;
      if (user.user.bot !== true) {
        user.voice.setChannel(channels[count]);
      }
      if (count === 2) {
        count = 0;
      } else {
        count++;
      }
      console.log(`Added ${user.user.username} to room ${count}`);
    });
  }
});



client.on("messageCreate", async (message) => {
  if (message.content === "!delete") {
    const channelName = "Breakout-";

    const voiceChannelName = "MONDAY";
    const voiceChannel = message.guild.channels.cache.find(
      (channel) => channel.name === voiceChannelName
    );

    const interactionChannel = message.channel;
    const category = interactionChannel.parent;

    const userChannel = Array.from(category.children.cache.values()).find(
      ({ name }) => name.includes("general")
    );

    const usersInLobby = Array.from(userChannel.members.values());

    let filtered = usersInLobby.filter((user) => {
      return user.user.bot === false;
    });

    const movePromises = filtered.map(async (user) => {
      
      console.log(user.user.id);
     const member = await message.guild.members.fetch(user.user.id);
      if (member.voice) {
        member.voice
          .setChannel(voiceChannel)
          .catch((error) => console.error(`Error moving member: ${error}`));
      } else {
        console.log(`User ${user.user.username} is not in a voice channel.`);
       
      }
    });

    await Promise.all(movePromises);

    for (let i = 1; i <= 3; i++) {
      const channel = message.guild.channels.cache.find(
        (ch) => ch.name === `${channelName}${i}`
      );
      channel.delete().catch((error) => {
        console.error(`Error deleting channel: ${error}`);
        message.reply("An error occurred while deleting the channel.");
      });
    }
    message.reply(`Breakout channels have been deleted.`);
  }
});


client.login(`${process.env.GITHUB_TOKEN}`);
