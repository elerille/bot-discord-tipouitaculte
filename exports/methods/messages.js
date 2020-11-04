module.exports = {
  fetchMessageFromUrl: function (url, msg, cmd = "react") {
    const urlParts = url.split("/")
    const server = Discord.guilds.resolve(urlParts[4])
    if(server) {
      const chan = server.channels.resolve(urlParts[5])
      if(chan) {
        return chan.messages.fetch(urlParts[6])
      } else return TiCu.Log.Error(cmd, "salon introuvable", msg)
    } else return TiCu.Log.Error(cmd, "serveur introuvable", msg)
  },
  fetchMessageFromId: function (channelId, messageId, msg, cmd = "react") {
    const server = tipoui
    const chan = TiCu.Mention(channelId)
    if (chan) {
      return chan.messages.fetch(messageId)
    } else {
      return TiCu.Log.Error(cmd, "salon introuvable", msg)
    }
  },
  getTextFromRawParams: function (rawParams, nbToAvoid) {
    for (let i=0; i < nbToAvoid; i++) {
      rawParams.shift()
    }
    let reason = ""
    for (const rawParam of rawParams) {
      reason += (rawParam + " ")
    }
    return reason
  }
}