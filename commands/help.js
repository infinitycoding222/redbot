const Discord = require('discord.js');

exports.run = (client, message, args) => {
 
let helpembed = new Discord.RichEmbed()
.setColor(0x51267)
.setThumbnail(client.user.displayAvatarURL)
.setTimestamp()
.setDescription('**Commands:**\n_spotify_ - Shows your spotify status\n_avatar_ - Shows yours/someone else\'s avatar\n_chat_ - Sends a text message in the same channel as where the command was typed\n_eval_ - Evaluates a code [Bot Owner only]\n_hi_ - Sends a message with context "Hi"\n_meme_ - Generates a meme\n_mention-role_ - Mentions a role if its mentionable\n_ping_ - Shows your ping.\n\n**Features:**\n_Starboard_')
message.channel.send(helpembed)
  
}
