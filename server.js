// lets define discord
const Discord = require("discord.js"); // discord.js
const client = new Discord.Client(); // client]const antispam = require('better-discord-antispam'); // Requiring this module.
const antispam = require('better-discord-antispam'); // Requiring this module.
const weirdapi = require("weirdapi.js");

// on ready
client.on("ready", () => {
  
  const readytxt = `
__________________________________
Logged In Successfully!
UserName: ${client.user.tag}
ID: ${client.user.id}
Servers: ${client.guilds.size}
Users: ${client.users.size}
Emojis: ${client.emojis.size}
__________________________________

`
//   console.log(readytxt); // print ^
//   antispam(client, {
//     limitUntilWarn: 3, // The amount of messages allowed to send within the interval(time) before getting a warn.
//     limitUntilMuted: 5, // The amount of messages allowed to send within the interval(time) before getting a muted.
//     interval: 2000, // The interval(time) where the messages are sent. Practically if member X sent 5+ messages within 2 seconds, he get muted. (1000 milliseconds = 1 second, 2000 milliseconds = 2 seconds etc etc)
//     warningMessage: "if you don't stop from spamming, I'm going to punish you!", // Message you get when you are warned!
//     muteMessage: "was muted since we don't like too much advertisement type people!", // Message sent after member X was punished(muted).
//     maxDuplicatesWarning: 7,// When people are spamming the same message, this will trigger when member X sent over 7+ messages.
//     maxDuplicatesMute: 10, // The limit where member X get muted after sending too many messages(10+).
//     ignoredRoles: ["Admin"], // The members with this role(or roles) will be ignored if they have it. Suggest to not add this to any random guys. Also it's case sensitive.
//     // ignoredMembers: "], // These members are directly affected and they do not require to have the role above. Good for undercover pranks.
//     mutedRole: "Muted", // Here you put the name of the role that should not let people write/speak or anything else in your server. If there is no role set, by default, the module will attempt to create the role for you & set it correctly for every channel in your server. It will be named "muted".
//     timeMuted: 1000 * 600, // This is how much time member X will be muted. if not set, default would be 10 min.
//     logChannel: "modmails" // This is the channel where every report about spamming goes to. If it's not set up, it will attempt to create the channel.
//   });
  
});

client.on("message", async (message) => {
  
  client.emit('checkMessage', message);
  if (!message.guild || message.author.bot) return;
  let prefix = ":?"
  
  if (!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(" ");
  let cmd = args.shift().toLowerCase();
  
  // Lets make command handler
  
  try {
    
    let commandFile = require(`./commands/${cmd}.js`);
    commandFile.run(client, message, args);
  } catch (e) {
    
    console.log(e)
    
  }
});
// serverstats
// on member add
client.on("guildMemberAdd", (member) => {

  var ops = {
    total: "total-membercount-channel-id",
    humans: "humans-count-channel-id",
    bots: "bots-count-channel-id"
  }
  
  member.guild.channels.get(ops.total).setName(`Total Members: ${member.guild.memberCount}`); // total membercount
  member.guild.channels.get(ops.humans).setName(`Humans: ${member.guild.members.filter(m => !m.user.bot).size}`); // humans
  member.guild.channels.get(ops.bots).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`); // bots

});

// on member remove
client.on("guildMemberRemove", (member) => {

  var ops = {
    total: "total-membercount-channel-id",
    humans: "humans-count-channel-id",
    bots: "bots-count-channel-id"
  }
  
  member.guild.channels.get(ops.total).setName(`Total Members: ${member.guild.memberCount}`); // total membercount
  member.guild.channels.get(ops.humans).setName(`Humans: ${member.guild.members.filter(m => !m.user.bot).size}`); // humans
  member.guild.channels.get(ops.bots).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`); // bots

});


//// starboard \\\\
client.on('raw', packet => {
 
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
   
    channel.fetchMessage(packet.d.message_id).then(message => {
       
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
        }
    });
});
 
client.on('messageReactionAdd', async (reaction, user) => {
 const message = reaction.message;
    if (reaction.emoji.name !== '⭐') return;
    if (message.author.id === user.id) return;
    if (message.author.bot) return;
    if (reaction.count < 3) return; // we need 3 stars for starboard
    const starChannel = client.channels.get(starboardChannelID)
    if (!starChannel) return;
    const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
   
    const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = message.attachments.size > 0 ? await (reaction, message.attachments.array()[0].url) : '';
      const embed = new Discord.RichEmbed()
        .setColor(foundStar.color)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setDescription(foundStar.description)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
        .setImage(image);
      const starMsg = await starChannel.fetchMessage(stars.id);
      await starMsg.edit({ embed });
    }
    if (!stars) {
      const image = message.attachments.size > 0 ? await (reaction, message.attachments.array()[0].url) : '';
      if (image === '' && message.cleanContent.length < 1) return;
      const embed = new Discord.RichEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription(`**[Jump To Message](${message.url})**\n\n${message.cleanContent}`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ 3 | ${message.id}`)
        .setImage(image);
      await starChannel.send({ embed });
    }
   
})
   
client.on('messageReactionRemove', async (reaction, user) => {
   
    const message = reaction.message;
    if (message.author.id === user.id) return;
    if (message.author.bot) return;
    if (reaction.emoji.name !== '⭐') return;
    const starChannel = client.channels.get(starboardChannelID)
    if (!starChannel) return;
    const fetchedMessages = await starChannel.fetchMessages({ limit: 100 });
    const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(reaction.message.id));
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const image = message.attachments.size > 0 ? await (reaction, message.attachments.array()[0].url) : '';
      const embed = new Discord.RichEmbed()
        .setColor(foundStar.color)
        .setDescription(`${foundStar.description}`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])-1} | ${message.id}`)
        .setImage(image);
      const starMsg = await starChannel.fetchMessage(stars.id);
      await starMsg.edit({ embed });
      if(parseInt(star[1]) - 1 == 2) return starMsg.delete(1000);
    }
 
});

client.login("NjYxNzM1MTM1Njk1MDc3Mzg2.Xgvvnw.uI4HhN54xNoFTGZU4Zyjqrypah8"); // login your bot to discord
