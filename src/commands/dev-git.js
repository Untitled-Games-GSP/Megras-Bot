module.exports = {
    name : "dev-git",
    desc : "The github developer interface",
    longdesc : "This command is supposed to be invisible >:(",
    examples : [
        { name: "You get NO EXAMPLES", value: "`Get owned!`" }
    ],
    visible : false,

    async Run(Bot, args, message) {
        if (message.author.id !== Bot.config.devId) { return; }
        if (args.length <= 0) { return; }
        // Run through developer commands
        switch (args[0].toLowerCase())
        {
            case "login":
                const { data: login } = await Bot.github.rest.users.getAuthenticated();
                message.channel.send(`Logged in as; ${login}`);
            break;
        }
    }

}