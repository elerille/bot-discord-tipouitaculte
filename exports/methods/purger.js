let nbMessages = 0

module.exports = {
  purgeChannels: function(salonIds, preservedTime = 90*DAY) {
    if (salonIds.length > 0) {
      const salonId = salonIds.shift()
      this.purgeSalon(salonIds, salonId, preservedTime)
    }
  },
  purgeSalon: function(salonIds, salonId, preservedTime) {
    const purgeLimitSnowflake = bignum(Date.now() - DISCORD_EPOCH - preservedTime).shiftLeft(22).toString()
    TiCu.DiscordApi.getMessagesBefore(
      salonId,
      purgeLimitSnowflake,
      (data) => {
        const dataArray = JSON.parse(data);
        if (dataArray.length > 0) {
          this.deleteMessages(salonIds, salonId, dataArray, preservedTime)
        } else {
          TiCu.Log.Purger(salonId)
          this.purgeChannels(salonIds, preservedTime)
        }
      }
    )
  },
  deleteMessages: function (salonIds, salonId, messages, preservedTime) {
    if (messages.length > 0) {
      TiCu.DiscordApi.deleteMessage(
        salonId,
        messages.shift().id,
        () => {
          this.deleteMessages(salonIds, salonId, messages, preservedTime)
        }
      )
    } else {
      this.purgeSalon(salonIds, salonId, preservedTime)
    }
  },
  purgeMember: function(guildId, memberId, skipNbFirstChannels = 0) {
    TiCu.DiscordApi.getGuildChannels(
      guildId,
      (data) => {
        const channelsArray = JSON.parse(data);
        const channelsToPurge = []
        for (const channel of channelsArray) {
          if (channel.type === 0) {
            channelsToPurge.push(channel.id)
          }
        }
        for (let i=0; i<skipNbFirstChannels; i++) {
          channelsToPurge.shift()
        }
        this.purgeMemberChannels(channelsToPurge, memberId)
      }
    )
  },
  purgeMemberChannels: function(channelsId, memberId) {
    const now = bignum(Date.now() - DISCORD_EPOCH).shiftLeft(22).toString()
    if (channelsId.length > 0) {
      const channelId = channelsId.shift()
      console.log("purge id : " + channelId)
      this.purgeMemberSalon(channelId, memberId, now, channelsId)
    } else {
      console.log("Purge finally ended")
    }
  },
  purgeMemberSalon: function(salonId, memberId, before, channelsId) {
    TiCu.DiscordApi.getMessagesBefore(
      salonId,
      before,
      (data) => {
        const messagesArray = JSON.parse(data);
        console.log(`Parsing ${messagesArray.length} messages from ${before}`)
        if (messagesArray.length > 0) {
          this.deleteMessagesMember(salonId, memberId, messagesArray, channelsId)
        } else {
          TiCu.Log.Purger(salonId, memberId)
          console.log(`Pugred ${nbMessages} messages in this channel`)
          nbMessages = 0
          this.purgeMemberChannels(channelsId, memberId)
        }
      }
    )
  },
  deleteMessagesMember: function(salonId, memberId, messages, channelsId) {
    const message = messages.shift()
    if (message.author.id === memberId) {
      nbMessages++
      TiCu.DiscordApi.deleteMessage(
        salonId,
        message.id,
        () => {
          if (messages.length > 0) {
            this.deleteMessagesMember(salonId, memberId, messages, channelsId)
          } else {
            this.purgeMemberSalon(salonId, memberId, message.id, channelsId)
          }
        }
      )
    } else {
      if (messages.length > 0) {
        this.deleteMessagesMember(salonId, memberId, messages, channelsId)
      } else {
        this.purgeMemberSalon(salonId, memberId, message.id, channelsId)
      }
    }
  }
}