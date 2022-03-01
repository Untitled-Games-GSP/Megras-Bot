const { Document, Paragraph, Packer, TextRun, Table, TableRow, TableCell } = require("docx");
const FS = require("fs");

const Embed = require("../templates/embeds.js");

function generateDocs(gitCommits) {
    let commits = [];
    allCommits.forEach((commit, key) => {
        let commitText = `${commit.name} committed in ${(key.split(';'))[0]} on ${commit.date}.\n${commit.message}.\n${commit.url}`;
        let tableEntry = new TableRow({
            children: [new TableCell({ children: [new Paragraph({ text: commitText })] })]
        })
        commits.push(tableEntry);
    });

    const doc = new Document({
        sections: [{
            children: [Table({rows: commits})]
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
        let allCommits = Bot.store.git.commits.fetchEverything();
        generateDocs(allCommits);

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