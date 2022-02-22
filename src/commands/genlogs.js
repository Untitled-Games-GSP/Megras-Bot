const { Document, Paragraph, Packer, TextRun } = require("docx");
const FS = require("fs");

const Embed = require("../templates/embeds.js");

function generateDocs(Bot)
{
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun("Hello World"),
                        new TextRun({
                            text: "Foo Bar",
                            bold: true,
                        }),
                        new TextRun({
                            text: "\tGithub is the best",
                            bold: true,
                        }),
                    ]
                })
            ]
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
        generateDocs(Bot);
        const embed = Embed.SimpleEmbed("Generated docs", "Saved internally");
        if (args.length <= 0) { message.reply({ embeds: [embed] }); return; }

        switch (args[0].toLowerCase())
        {
            case "upload":
            case "up":

            break;
        }
    }

}