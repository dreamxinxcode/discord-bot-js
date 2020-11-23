module.exports = {
  name: 'stats',
  description: 'Server insights',
  execute(msg) {
    msg.channel.send(`Server name: ${msg.guild} \nTotal members: ${msg.guild.memberCount} \nCreated at: ${msg.guild.createdAt} \nRegion: ${msg.guild.region}`);
  },
};