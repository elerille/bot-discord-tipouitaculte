module.exports = {
  alias: [
    "delete"
  ],
  activated: true,
  name : "Delete",
  desc : "Supprime un message.",
  schema : "!delete <#channel> <idMessage>\nou\n!delete <urlMessage>",
  authorizations : TiCu.Authorizations.getAuth("command", "delete"),
  run : function(params, msg) {
    if (params.length < 1) {
      return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    }
    let promiseToMessage
    const isById = TiCu.Channels.isValidChannelId(params[0])
    if (isById) {
      promiseToMessage = TiCu.Messages.fetchMessageFromId(params[0], params[1], msg, "delete")
    } else {
      promiseToMessage = TiCu.Messages.fetchMessageFromUrl(params[0], msg, "delete")
    }
    if (promiseToMessage) {
      promiseToMessage.then(
        messageToDelete => {
          msg.reply(`voulez-vous vraiment supprimer ce message ?`)
            .then(newMsg => {
              newMsg
                .react("👍")
                .then(() => newMsg.react("👎"))
                .then(() => {
                  let filter = (reaction, user) => {
                    return (user.id === msg.author.id)
                  }
                  newMsg
                    .awaitReactions(filter, {max: 1, time: 10000, errors: ["time"]})
                    .then(collected => {
                      const reaction = collected.firstKey();
                      if (reaction === "👍") {
                        messageToDelete.delete().then(() => {
                          TiCu.Log.Commands.Delete(messageToDelete, msg)
                        })
                      } else {
                        return TiCu.Log.Error("delete", "annulation", msg)
                      }
                    })
                    .catch(collected => {
                      if (!collected) Event.emit("cancelAwait", "delete", messageToDelete.url)
                    })
                })
            })
        }
      ).catch(() => TiCu.Log.Error("delete", "impossible de trouver le message à supprimer", msg))
    } else TiCu.Log.Error("delete", "impossible de trouver le message à supprimer", msg)
  }
}
