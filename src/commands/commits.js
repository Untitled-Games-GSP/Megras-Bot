
async function RetreiveCommits(Bot)
{
    // Iterate throughe every repository
    Bot.config.repos.forEach((repo) => {
        const latest = await Bot.github.request(`GET /repos/{owner}/{repo}/commits`, {
            owner: repo.owner, repo: repo.repo, per_page: 100
        }); 
        latest.data.forEach((d) => {
            const commit = d.commit;
            if (Bot.store.git.commits.has(commit)) 
            { 

            }
        });

    });
}

module.exports = {
    name : "commits",
    desc : "Retrieve commits from the UCSG respositories",
    longdesc : "Retrieves commits from the specified repos and caches them internally",
    examples : [
        { name: "Retrieve commits", value: "`$commits`" }
    ],
    visible : true,

    async Run(Bot, args, message) {
        await RetreiveCommits();
    }

}