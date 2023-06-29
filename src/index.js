const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
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
      ({ name }) => name.includes("text")
    );

    const usersInLobby = Array.from(userChannel.members.values());

    let filtered = usersInLobby.filter((user) => {
        return user.user.bot === false;
    })


      await filtered.forEach((user, index) => {
        let count = index % 3;
        if(user.user.bot !== true) {
        user.voice.setChannel(channels[count]);
        }
        if (count === 2) {
          count = 0;
        } else {
          count++;
        }
        console.log(`Added ${user.user.username} to room ${count}`)
      })

  }
});

client.on("message", message => {
  if (message.content.startsWith("!deletechannel")) {
    // Get the channel name from the command
    //const channelName = message.content.substring("!deletechannel".length).trim();
    const channelName = "Breakout-";

    for (let i = 1; i <= 3; i++) {
	// Find the channel by name
	const channel = message.guild.channels.cache.find(ch => ch.name === `${channelName}${i}`);
	// Delete the channel
	channel.delete()
		.then(() => {
		  message.reply(`Channel '${channelName}${i}' has been deleted.`);
		})
		.catch(error => {
		  console.error(`Error deleting channel: ${error}`);
		  message.reply('An error occurred while deleting the channel.');
		});

    }

    if (!channel) {
      message.reply(`Channel '${channelName}' not found.`);
    } else {
        }
  }
});

client.login(`${process.env.GITHUB_TOKEN}`);
