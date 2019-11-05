module.exports = function(target, content, origin) {
  let type = Discord.channels.get(target) ? "channels" : Discord.users.get(target) ? "users" : false
  if(type){
    Discord[type].get(target).send(content)
      .then(sentMsg => Event.emit("send", sentMsg))
      .catch(error => Event.emit("error", "sendRoot", "erreur inattendue", error))
  } else Event.emit("error", "sendRoot", "destination invalide", origin)
}
