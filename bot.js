const Discord = require('discord.js');
const { token, prefix } = require('./config.json');
const axios = require('axios');

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.log(`${msg.author.username}: ${msg.content}`);
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
  
  if (msg.content === `${prefix}stats`) {
    console.log(client.presence.status)
    client.user.setUsername('JS TEST BOT')
    msg.channel.send(`Server name: ${msg.guild} \nTotal members: ${msg.guild.memberCount} \nCreated at: ${msg.guild.createdAt} \nRegion: ${msg.guild.region}`)
  }

  if (msg.content === `${prefix}kanye`) {
    axios.get('https://api.kanye.rest/')
    .then(res => {
      msg.channel.send(`${res.data.quote} \n- Kanye West`);
    })
    .catch(e => console.log(e));
  }
});

client.login(token);

