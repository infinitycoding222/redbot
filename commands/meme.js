const weirdapi = require('weirdapi.js');
const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args) => {
  
  let meme = weirdapi.meme()
  
  const embed = new RichEmbed()
  .setAuthor("Memes")
  .setImage(meme)
  .setColor("BLUE")
  .setTimestamp()
  .setFooter("weirdapi.js | https://theweirdapi.glitch.me/")
  
  message.channel.send(embed)
  
}
