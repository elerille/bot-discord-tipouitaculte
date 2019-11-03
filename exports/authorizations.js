module.exports = function(type, cmd, msg) {
  let chan = TiCu.Commands.prefixed[cmd].authorizations.chans.find(e => e === msg.channel.id)
  let role = TiCu.Commands.prefixed[cmd].authorizations.roles.find(e => e === msg.author.roles.get(e))
  let auth = TiCu.Commands.prefixed[cmd].authorizations.auths.find(e => e === msg.author.id)
  return (chan && ( role || auth ) )
}
