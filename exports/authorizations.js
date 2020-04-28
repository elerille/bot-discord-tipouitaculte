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
    const target = TiCu.Commands[cmd].authorizations[msg.channel.type === "dm" ? "dm" : msg.guild.id]
    if (!target) {
      return false
    }
    const chan = msg.channel.type === "dm" || authorized(target.chans, msg.channel.id)
    const auth = authorized(target.auths, msg.author.id)
    let role
    if(target.roles.type !== "any") {
      const member = tipoui.members.get(msg.author.id)
      if (member) {
        let array = Array.from(member.roles.values())
        let filtered = array.filter(e => target.roles.list.includes(e.id))
        if (target.roles.type === "whitelist") {
          role = !!filtered.length
        } else {
          role = !filtered.length
        }
      } else role = false
    } else role = true
    return chan && role && auth
  },
  Reaction : function(reactionFunction, reaction, usr) {
    if (reaction.message.channel.type === "dm") { //doesn't seem to be useful on DMs
      return false
    }
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
    if (msg.channel.type === "dm") { //doesn't seem to be useful on DMs, or should be retuned at least
      return false
    }
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
    if (authorizations[type].dm[name]) {
      auth["dm"] = authorizations[type].dm[name]
    }
    return auth
  }
}
