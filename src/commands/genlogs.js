const { Document, Paragraph, Packer, TextRun, Table, TableRow, TableCell, ShadingType } = require("docx");
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

    let aShading = { fill: "bae3ff", type: ShadingType.CLEAR, color: "auto" };
    let bShading = { fill: "9ed8ff", type: ShadingType.CLEAR, color: "auto" };

    // Save all commits to docx table objects
    let commits = []; let alt = true;
    allCommits.forEach((commit) => {
        let commitText = ` committed in  on .\n.\n`;
        let altShading = (alt ? aShading : bShading); alt = !alt;
        let tableEntry = new TableRow({
            children: [
                new TableCell({ children: [new Paragraph({ text: `${commit.name}` })], shading: altShading }),
                new TableCell({ children: [new Paragraph({ text: `${commit.repo}` })], shading: altShading }),
                new TableCell({ children: [new Paragraph({ text: `${commit.message}` })], shading: altShading }),
                new TableCell({ children: [new Paragraph({ text: `${commit.date}` })], shading: altShading }),
                new TableCell({ children: [new Paragraph({ text: `${commit.url}` })], shading: altShading })
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
        FS.writeFileSync("Commit Logs.docx", buffer);
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
        // Generate logs and save internally
        if (args.length <= 0) { 
            let allCommits = Bot.store.git.commits.fetchEverything();
            generateDocs(allCommits);
            message.reply({ embeds: [Embed.SimpleEmbed("Generated docs", "Saved internally")] }); 
            return; 
        }

        // Upload logs from local storage
        switch (args[0].toLowerCase())
        {
            case "upload":
            case "up":
                message.channel.send({files: ["./Commit Logs.docx"]});
            break;
        }
    }

}