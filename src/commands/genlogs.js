const { Document, Paragraph, Packer, TextRun, Table, TableRow, TableCell } = require("docx");
const FS = require("fs");

const Embed = require("../templates/embeds.js");

function generateDocs(gitCommits) {
    // Save all git commits to an array
    let allCommits = [];
    gitCommits.forEach((commit, key) => {
        allCommits.push({
            name: commit.name,
            repo: `${(key.split(';'))[0]}`,
            message: commit.message,
            date: commit.date,
            url: commit.url
        });
    })
    
    // Sort array by date
    allCommits.sort((a, b) => {
        return Date.parse(b.date) - Date.parse(a.date);
    });

    // Save all commits to docx table objects
    let commits = [];
    allCommits.forEach((commit) => {
        let commitText = ` committed in  on .\n.\n`;
        let tableEntry = new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ text: `${commit.name}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${commit.repo}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${commit.message}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${commit.date}` })] }),
                new TableCell({ children: [new Paragraph({ text: `${commit.url}` })] })
            ]
        })
        commits.push(tableEntry);
    });

    // Create document
    const doc = new Document({
        sections: [{
            children: [new Table({rows: commits})]
        }]
    });

    // Save document to local storage
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