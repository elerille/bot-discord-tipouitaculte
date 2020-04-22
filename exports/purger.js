const DISCORD_EPOCH = 1420070400000

module.exports = {
  purgeSalon: function(salonId, preservedTime = 90*24*60*60*1000) {
    const purgeLimitSnowflake = bignum(Date.now() - DISCORD_EPOCH - preservedTime).shiftLeft(22).toString()
    TiCu.DiscordApi.getMessagesBefore(
      salonId,
      purgeLimitSnowflake,
      (data) => {
        const dataArray = JSON.parse(data);
        if (dataArray.length > 0) {
          this.deleteMessages(salonId, dataArray)
        } else {
          console.log(`Purge ended for <#${salonId}>`)
        }
      }
    )
  },
  deleteMessages: function (salonId, messages) {
    if (messages.length > 0) {
      TiCu.DiscordApi.deleteMessage(
        salonId,
        messages.shift().id,
        () => {
          this.deleteMessages(salonId, messages)
        }
      )
    } else {
      this.purgeSalon(salonId)
    }
  }
}