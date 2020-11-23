const Discord = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Filter all non-JS files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('ready', () => {
  console.log(`Logged in as ${chalk.cyan.bold(client.user.tag)}`);
});

client.on('message', msg => {
  console.log(`${chalk.bold(msg.author.username + ':')} ${msg.content}`);

  if (!msg.content.startsWith(prefix) || msg.author.bot) {
    return;
  }

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) {
    return;
  }

  const command = client.commands.get(commandName);

  if (command.guildOnly && msg.channel.type === 'dm') {
    return msg.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${msg.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

    return msg.channel.send(reply);
  }

  try {
    command.execute(msg, args);
  }
  catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(msg.author.id)) {
    const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }
});

client.login(token);

