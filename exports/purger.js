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
          TiCu.Log.Purger(salonId)
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
  },
  purgeMember: function(guildId, memberId) {
    const now = bignum(Date.now() - DISCORD_EPOCH).shiftLeft(22).toString()
    TiCu.DiscordApi.getGuildChannels(
      guildId,
      (data) => {
        const channelsArray = JSON.parse(data);
        for (const channel of channelsArray) {
          if (channel.type === 0) {
            this.purgeMemberSalon(channel.id, memberId, now)
          }
        }
      }
    )
  },
  purgeMemberSalon: function(salonId, memberId, before) {
    TiCu.DiscordApi.getMessagesBefore(
      salonId,
      before,
      (data) => {
        const messagesArray = JSON.parse(data);
        if (messagesArray.length > 0) {
          this.deleteMessagesMember(salonId, memberId, messagesArray)
        } else {
          TiCu.Log.Purger(salonId, memberId)
        }
      }
    )
  },
  deleteMessagesMember: function(salonId, memberId, messages) {
    const message = messages.shift()
    if (message.author.id === memberId) {
      TiCu.DiscordApi.deleteMessage(
        salonId,
        message.id,
        () => {}
      )
    }
    if (messages.length > 0) {
      this.deleteMessagesMember(salonId, memberId, messages)
    } else {
      this.purgeMemberSalon(salonId, memberId, message.id)
    }
  }
}