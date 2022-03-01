const { Document, Paragraph, Packer, TextRun, Table, TableRow, TableCell } = require("docx");
const FS = require("fs");

const Embed = require("../templates/embeds.js");

function generateDocs(gitCommits) {
    let commits = [];
    gitCommits.forEach((commit, key) => {
        let commitText = ` committed in  on .\n.\n`;
        let tableEntry = new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ text: `${commit.name}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${(key.split(';'))[0]}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${commit.message}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${commit.url}` })] })
            ]
        })
        commits.push(tableEntry);
    });

    const doc = new Document({
        sections: [{
            children: [new Table({rows: commits})]
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