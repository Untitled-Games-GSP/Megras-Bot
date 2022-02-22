const Embed = require("../templates/embeds.js");

module.exports = {
    name : "commits",
    desc : "Retrieve commits from the UCSG respositories",
    longdesc : "Retrieves commits from the specified repos and caches them internally",
    examples : [
        { name: "Retrieve commits", value: "`$commits`" }
    ],
    visible : true,

    async Run(Bot, args, message) {
        // Iterate through every repository
        for (const repo of Bot.config.repos) {
            // Retreive 100 latest commits
            const latest = await Bot.github.request(`GET /repos/{owner}/{repo}/commits`, {
                owner: repo.owner, repo: repo.repo, per_page: 100
            }); 
            // Iterate through every latest commit
            latest.data.forEach((d) => {
                const commit = d.commit;

                // If commit doesn't exist in cache, add it to cache
                const log = `${commit.committer.name};${commit.committer.date}`;
                if (!Bot.store.git.commits.has(log)) 
                { 
                    Bot.store.git.commits.set(log, {
                        name: commit.committer.name,
                        email: commit.committer.email,
                        date: commit.committer.date,
                        message: commit.message,
                        url: commit.url
                    });
                }
            });
        }

        message.reply({ embeds: [Embed.SimpleEmbed("Successfully retreieved commits", "Cached to bot")] });
    }

}