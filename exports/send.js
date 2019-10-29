module.exports = function(target, content) {
    Discord.channels.get(target).send(content)
        .then(message => Event.emit("send", message))
}