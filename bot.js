// DiscordJS API initialization
const { Client, Intents } = require("discord.js");
var Bot = { client : new Client({ intents: [
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
    Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
] }) };

// Config initialization
Bot.config = require("./src/config.json");

// SQL storage initialization
const Enmap = require("enmap");
Bot.store = {
    dev : new Enmap({ name: "dev", fetchAll: false, dataDir: "./store" }),
    git : {
        commits : new Enmap({ name: "gitCommits", fetchAll: false, dataDir: "./store" })
    }
};

// Command manager initialization
const FS = require("fs");
const CMDFiles = FS.readdirSync("./src/commands").filter(i => i.endsWith(".js"));
const CMDAliases = require("./src/aliases.json");
Bot.commands = new Map(); Bot.commandsList = [];
CMDFiles.forEach((file) => { 
    const cmd = require(`./src/commands/${file}`); 
    Bot.commands.set(cmd.name, cmd); 
    if (cmd.visible) Bot.commandsList.push({ name: cmd.name, desc: cmd.desc }); 
    cmd.examples.forEach((e, i, example) => { example[i].value = example[i].value.replaceAll("$", Bot.config.prefix); });
});
CMDAliases.aliases.forEach((alias) => { Bot.commands.set(alias.alias, Bot.commands.get(alias.cmd)); });

// API keys initialization
Bot.keys = require("./src/secret/keys.json");

// Github API initialization
const { Octokit } = require("octokit");
Bot.github = new Octokit({ auth: Bot.keys.github });

// Setup ready listener
Bot.client.on("ready", () => {
    console.log(`Logged into Discord as ${Bot.client.user.tag}`);
    console.log(`Loaded ${Bot.commands.size - CMDAliases.aliases.length} commands`);
    Bot.client.user.setActivity({ name: `${Bot.config.prefix}help`, type: "STREAMING", url: Bot.config.statusUrl });

    // Check if bot was recently updated
    if (Bot.store.dev.has("update")) {
        let load = Bot.store.dev.get("update");
        if (load.recent) {
            Bot.store.dev.set("update", false, "recent");
            Bot.client.guilds.cache.get(load.guild).channels.cache.get(load.channel).send(`${load.issuer}, Logger has restarted and updated.`);
        }
    }
});

// Setup message listener
Bot.client.on("messageCreate", (message) => {
    if (message.author.bot) { return; }

    // Check server targets
    let inServer = false;
    Bot.config.serverTargets.forEach((id) => { inServer |= (id === message.guildId); });
    if (!inServer) { return; }

    // Reject without prefix
    if (!message.content.startsWith(Bot.config.prefix)) { return; }

    // Command handling
    let args = message.content.slice(Bot.config.prefix.length).split(" ");
    let command = args.shift().toLowerCase();
    if (!Bot.commands.has(command)) { return; }
    try {
        Bot.commands.get(command).Run(Bot, args, message);
    } catch (err) {
        console.error(err);
    }

});

// Log into discord
Bot.client.login(Bot.keys.token);