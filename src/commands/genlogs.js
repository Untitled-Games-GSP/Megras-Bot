const { Document, Paragraph, Packer, TextRun, Table, TableRow, TableCell } = require("docx");
const FS = require("fs");

const Embed = require("../templates/embeds.js");

function generateDocs(gitCommits)
{
    let commits = [];
    gitCommits.forEach((commit, key) => {
        const row = new TableRow({
            children: [new TableCell({
                children: [new Paragraph({ text: `${commit.name} committed in repository on ${commit.date}.\n${commit.message}.\n${commit.url}` })]
            })]
        });
        commits.push(row);
    });

    const commitTable = new Table({
        rows: commits
    });

    const doc = new Document({
        sections: [{
            children: [commitTable]
        }]
    });

    Packer.toBuffer(doc).then((buffer)=> {
        FS.writeFileSync("Test Doc.docx", buffer);
    })
}

module.exports = {
    name : "genlogs",
    desc : "Generate the document logs",
    longdesc : "Generate document logs for the cached commits, upload them to discord",
    examples : [
        { name: "Generate document logs", value: "`$genlogs`" },
        { name: "Upload the generated document logs", value: "`$genlogs upload`" }
    ],
    visible : true,

    Run(Bot, args, message) {
        generateDocs(Bot.store.git.commits);
        const embed = Embed.SimpleEmbed("Generated docs", "Saved internally");
        if (args.length <= 0) { message.reply({ embeds: [embed] }); return; }

        switch (args[0].toLowerCase())
        {
            case "upload":
            case "up":
                message.channel.send({files: ["./Test Doc.docx"]});
            break;
        }
    }

}