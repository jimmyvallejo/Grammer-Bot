const { Client, IntentsBitField } = require("discord.js");

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

        
      }

      message.reply("Created 3 breakout channels!");
    } else {
      message.reply("You don't have permission to create channels.");
    }
    let currentChannel = await message.channel.parentId;
    let userChannel = await client.channels.cache.get(currentChannel)
   
       let users = userChannel.members.map((user) => {
        return user.id
       })
       console.log(users)
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "!myroles") {
    const roles = message.member.roles.cache
      .map((role) => role.name)
      .join(", ");
    message.reply(`Your roles: ${roles}`);
  }
});

client.login(
  "MTEyMzcwNTMzNzI1ODcwNDk5Mg.GlqiTh.gHWiSy_F_hi8_AFid8DNONbWwEh0Mec1ipgYJQ"
);
