module.exports = function(param) {
  let target
  let snow = new RegExp(/(\d+)/)
  let role = new RegExp(/^<@&(\d+)>$/)
  let user = new RegExp(/^<@!?(\d+)>$/)
  let channel = new RegExp(/^<#(\d+)>$/)
  let discriminated = new RegExp(/#\d{4}$/)
  let type = param.match(role) ? "role" : param.match(user) ? "user" : param.match(channel) ? "channel" : param.match(discriminated) ? "discriminated" : param.match(snow) ? "snow" : "text"
  switch (type) {
    case "role":
      target = tipoui.roles.resolve(param.match(snow)[1])
      break
    case "user":
      target = tipoui.members.resolve(param.match(snow)[1])
      break
    case "channel":
      target = Discord.channels.resolve(param.match(snow)[1])
      break
    case "discriminated":
      target = tipoui.members.cache.find(e => e.user.tag === param)
      break
    case "snow":
      if(tipoui.members.resolve(param.match(snow)[1])) {
        target = tipoui.members.resolve(param.match(snow)[1])
      } else if(Discord.channels.resolve(param.match(snow)[1])) {
        target = Discord.channels.resolve(param.match(snow)[1])
      } else if(tipoui.roles.cache.get(param.match(snow)[1])) {
        target = tipoui.roles.cache.get(param.match(snow)[1])
      } else {
        target = false
      }
      break
    case "text":
      if(tipoui.members.cache.find(e => e.user.username === param)) {
        target = tipoui.members.cache.find(e => e.user.username === param)
      } else if(tipoui.members.cache.find(e => e.displayName === param)) {
        target = tipoui.members.cache.find(e => e.displayName === param)
      } else if(tipoui.channels.cache.find(e => e.name === param)) {
        target = tipoui.channels.cache.find(e => e.name === param)
      } else if(Discord.guilds.resolve(PUB.servers.vigi.id).channels.cache.find(e => e.name === param)) {
        target = Discord.guilds.resolve(PUB.servers.vigi.id).channels.cache.find(e => e.name === param)
      } else if(Discord.guilds.resolve(PUB.servers.debug.id).channels.cache.find(e => e.name === param)) {
        target = Discord.guilds.resolve(PUB.servers.debug.id).channels.cache.find(e => e.name === param)
      } else if(tipoui.roles.cache.find(e => e.name === param)) {
        target = tipoui.roles.cache.find(e => e.name === param)
      } else {
        target = false
      }
      break
    default:
      target = false
      break
  }
  return target
}
