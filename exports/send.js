module.exports = function(target, msg) {
  if(target) {
    Discord.channels.get(target).send(content)
      .then(sentMsg => Event.emit("send", sentMsg))
      .catch(error => Event.emit("error", "send", "erreur inattendue", msg))
  } else Event.emit("error", "send", "destination invalide", msg)
}
