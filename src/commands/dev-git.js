const Embed = require("../templates/embeds.js");

module.exports = {
    name : "dev-git",
    desc : "The github developer interface",
    longdesc : "This command is supposed to be invisible >:(",
    examples : [
        { name: "You get NO EXAMPLES", value: "`Get owned!`" }
    ],
    visible : false,

    async Run(Bot, args, message) {
        let dev = false;
        Bot.config.devIds.forEach((id) => { dev |= (message.author.id === id); }); if (!dev) { return; }
        if (args.length <= 0) { return; }
        // Run through developer commands
        switch (args[0].toLowerCase())
        {
            case "login":
                const { data: { login } } = await Bot.github.rest.users.getAuthenticated();
                message.channel.send(`Logged in as; ${login}`);
            break;
            case "commits":
                const latest = await Bot.github.request(`GET /repos/{owner}/{repo}/commits`, {
                    owner: Bot.config.repos[0].owner, repo: Bot.config.repos[0].repo, per_page: 100
                }); 
                let latestCommit = latest.data[0].commit;
                message.channel.send({ embeds: [Embed.SimpleEmbed(latestCommit.author.name, latestCommit.message)] });
            break;
        }
    }

}