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
    const target = TiCu.Commands[cmd].authorizations[msg.guild.id]
    if (!target) {
      return false
    }
    const chan = authorized(target.chans, msg.channel.id)
    const auth = authorized(target.auths, msg.author.id)
    let role
    if(target.roles.type !== "any") {
      let array = Array.from(msg.member.roles.values())
      let filtered = array.filter(e => target.roles.list.includes(e.id))
      if(target.roles.type === "whitelist") {
        role = !!filtered.length
      } else {
        role = !filtered.length
      }
    } else role = true
    return chan && role && auth
  },
  Reaction : function(reactionFunction, reaction, usr) {
    const messages = authorized(reactionFunction.authorizations.messages, reaction.message.id)
    const salons = authorized(reactionFunction.authorizations.salons, reaction.message.channel.id)
    const users = authorized(reactionFunction.authorizations.users, usr.id)
    return messages && salons && users
  },
  Auto : function(autoCommand, msg) {
    const salons = authorized(autoCommand.authorizations.salons, msg.channel.id)
    const users = authorized(autoCommand.authorizations.users, msg.author.id)
    return salons && users
  },
  getAuth : function(type, name) {
    const auth = {}
    if (authorizations[type].commu) {
      auth[PUB.servers.commu] = authorizations[type].commu[name]
    }
    if (authorizations[type].vigi) {
      auth[PUB.servers.vigi] = authorizations[type].vigi[name]
    }
    if (authorizations[type].debug[name]) {
      auth[PUB.servers.debug] = authorizations[type].debug[name]
    }
    return auth
  }
}
