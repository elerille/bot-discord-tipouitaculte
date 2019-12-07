function authorized(authorization, value) {
  switch (authorization.type) {
    case "any":
      return true
    case "whitelist":
      return !!authorization.list.find(e => e === value)
    case "blacklist":
      return !authorization.list.find(e => e === value)
    default:
      return false
  }
}

module.exports = {
  Command : function(cmd, msg) {
    let target = TiCu.Commands[cmd].authorizations
    let chan = authorized(target.chans, msg.channel.id)
    let role = target.roles.type === "any" ?
      true :
      target.roles.type === "whitelist" ?
        target.roles.list.find(e => e === msg.author.roles.get(e)) :
        target.roles.type === "blacklist" ?
          !target.roles.list.find(e => e === msg.author.roles.get(e)) :
          false
    let auth = authorized(target.auths, msg.author.id)
    return (chan && ( role || auth ))
  },
  Reaction : function(reactionFunction, reaction, usr) {
    let messages = authorized(reactionFunction.authorizations.messages, reaction.message.id)
    console.log(messages)
    let salons = authorized(reactionFunction.authorizations.salons, reaction.message.channel.id)
    console.log(salons)
    let users = authorized(reactionFunction.authorizations.users, usr.id)
    console.log(users)
    return messages && salons && users
  }
}
