const Embed = require("../templates/embeds.js");

module.exports = {
    name : "showcommits",
    desc : "Display recent commits on Discord",
    longdesc : "Retrieves cached commits from the bot and displays them on Discord",
    examples : [
        { name: "Show commits", value: "`$showcommits <amount>`" }
    ],
    visible : true,

    async Run(Bot, args, message) {
        let recent = 5;
        if (args.length > 0 && !isNaN(parseInt(args[0])) && parseInt(args[0]) > 0) { recent = parseInt(args[0]); }
        
        let commitMessages = [];
        Bot.store.git.commits.forEach((commit) => {
            if (recent > 0) {
                commitMessages.push({
                    name: commit.name,
                    value: `[${commit.message}](commit.url)`
                });
                recent--;
            }
        });

        message.reply({ embeds: [Embed.FieldEmbed("Recent commits", "", commitMessages)] });
    }

}