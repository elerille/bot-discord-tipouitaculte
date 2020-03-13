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
    const target = reactionFunction.authorizations[reaction.message.guild.id]
    if (!target) {
      return false
    }
    const messages = authorized(target.messages, reaction.message.id)
    const salons = authorized(target.salons, reaction.message.channel.id)
    const users = authorized(target.users, usr.id)
    return messages && salons && users
  },
  Auto : function(autoCommand, msg) {
    const target = autoCommand.authorizations[msg.guild.id]
    if (!target) {
      return false
    }
    const salons = authorized(target.salons, msg.channel.id)
    const users = authorized(target.users, msg.author.id)
    return salons && users
  },
  getAuth : function(type, name) {
    const auth = {}
    if (authorizations[type].commu[name]) {
      auth[PUB.servers.commu.id] = authorizations[type].commu[name]
    }
    if (authorizations[type].vigi[name]) {
      auth[PUB.servers.vigi.id] = authorizations[type].vigi[name]
    }
    if (authorizations[type].debug[name]) {
      auth[PUB.servers.debug.id] = authorizations[type].debug[name]
    }
    return auth
  }
}
