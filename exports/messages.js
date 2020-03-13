module.exports = {
  fetchMessageFromUrl: function (url, msg) {
    const urlParts = url.split("/")
    const server = Discord.guilds.get(urlParts[4])
    if(server) {
      const chan = server.channels.get(urlParts[5])
      if(chan) {
        return chan.fetchMessage(urlParts[6])
      } else return TiCu.Log.Error("react", "salon introuvable", msg)
    } else return TiCu.Log.Error("react", "serveur introuvable", msg)
  },
  fetchMessageFromId: function (channelId, messageId, msg) {
    const server = tipoui
    const chan = TiCu.Mention(channelId)
    if (chan) {
      return chan.fetchMessage(messageId)
    } else {
      return TiCu.Log.Error("react", "salon introuvable", msg)
    }
  }
}