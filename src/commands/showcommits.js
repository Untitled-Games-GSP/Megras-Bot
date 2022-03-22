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
        let iRecent = recent;
        
        // Get cached commits
        let commitMessages = [];
        let gitCommits = Bot.store.git.commits.fetchEverything();

        // Save relevant information to array
        let allCommits = [];
        gitCommits.forEach((commit, key) => {
            allCommits.push({
                name: commit.name,
                message: commit.message,
                date: commit.date,
                url: commit.url
            });
        })
        
        // Sort array by date
        allCommits.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });

        // Iterate through recent allCommits
        while (iRecent > 0) {
            commitMessages.push({
                name: allCommits[iRecent].name,
                value: `[${allCommits[iRecent].message}](${allCommits[iRecent].url})`
            });
            iRecent--;
        }

        message.reply({ embeds: [Embed.FieldEmbed("Recent commits", `${recent} most recent cached commits`, commitMessages)] });
    }

}