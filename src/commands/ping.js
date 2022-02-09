
module.exports = {
    name : "ping",
    desc : "Get the latency of the bot",
    longdesc : "Comes with some additional statistics",
    examples : [
        { name: "You get NO EXAMPLES", value: "`Get owned!`" }
    ],
    visible : false,

    Run(Bot, args, message) {
        message.reply("pong.");
    }

}