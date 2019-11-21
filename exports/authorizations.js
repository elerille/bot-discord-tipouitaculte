module.exports = function(cmd, msg) {
  let target = TiCu.Commands[cmd].authorizations
  let chan = target.chans.type === "any" ? true : target.chans.type === "whitelist" ? target.chans.list.find(e => e === msg.channel.id) : target.chans.type === "blacklist" ? target.chans.list.find(e => e === msg.channel.id) ? false : true : false
  let role = target.roles.type === "any" ? true : target.roles.type === "whitelist" ? target.roles.list.find(e => e === msg.author.roles.get(e)) : target.roles.type === "blacklist" ? msg.author.roles.get(e) ? false : true : false
  let auth = target.auths.type === "any" ? true : target.auths.type === "whitelist" ? target.auths.list.find(e => e === msg.author.id) : target.auths.type === "blacklist" ? (target.auths.list.find(e => e === msg.author.id)) ? false : true : false
  return (chan && ( role || auth ))
}
