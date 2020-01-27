function createUpdateEmbed(previousEmbed, newVote = false) {
  const previousFields = previousEmbed ? previousEmbed.fields : undefined
  const embed = new DiscordNPM.RichEmbed()
  embed.setAuthor("Recensement des votant-e-s")
  embed.setDescription("Vote de recensement des votant-e-s présent-e sur le serveur")

  const checkFieldName = "✅ : garder ou récupérer le rôle"
  const crossFieldName = "❌ : abandonner le rôle"
  embed.addField(checkFieldName, previousFields ? previousFields[previousFields.findIndex((v) => {return v.name === checkFieldName})].value : 0)
  embed.addField(crossFieldName, previousFields ? previousFields[previousFields.findIndex((v) => {return v.name === crossFieldName})].value : 0)

  const nbVotesName = "Nombre de votant-e-s"
  let nbVotes = previousFields ? previousFields[previousFields.findIndex((v) => {return v.name === nbVotesName})].value : 0
  if (newVote) {
    nbVotes++
  }
  embed.addField(nbVotesName, nbVotes)
  return embed
}

function createCollector(msg) {
  const newCollector = msg.createReactionCollector((reaction, user) => {
    return (!user.bot) && (["✅", "❌"].includes(reaction.emoji.name))
  })
  TiCu.Census.collector = newCollector
  newCollector.on("collect", (reaction) => {
    TiCu.Census.updateCensus(reaction)
  })
  newCollector.on("end", () => {
    TiCu.Census.closeCensus()
  })
}

module.exports = {
  closeCensus : function () {
    const jsonData = {
      action : "read",
      target : CensusFile
    }
    const censusData = TiCu.json(jsonData)
    const voteMembers = tipoui.roles.get(PUB.roles.vote.id).members
    for (const member of voteMembers.array()) {
      if (!censusData.members.includes(member.id)) {
        member.removeRole(PUB.roles.vote.id).then(() => {
          TiCu.Log.Census(member)
          member.send("Suite à l'absence de réaction sur le vote de recensement, vous avez perdu le rôle de votant-e. Vous pouvez le récupérer simplement en votant sur le prochain vote de recensement.")
        })
      }
    }
    censusData.members = []
    censusData.id = ""
    jsonData.action = "write"
    jsonData.content = censusData
    TiCu.json(jsonData)
  },
  initCensus : function () {
    const jsonData = {
      action : "read",
      target : CensusFile
    }
    const censusData = TiCu.json(jsonData)
    if (censusData.id) {
      tipoui.channels.get(PUB.salons.salleDesVotes.id).fetchMessage(censusData.id).then(
        msg => {
          msg.edit(createUpdateEmbed(msg.embeds[0]))
          createCollector(msg)
        }
      )
    } else {
      tipoui.channels.get(PUB.salons.salleDesVotes.id).send(createUpdateEmbed()).then(
        msg => {
          msg.react("✅")
          msg.react("❌")
          createCollector(msg)
          jsonData.action = "write"
          censusData.id = msg.id
          censusData.members = []
          jsonData.content = censusData
          TiCu.json(jsonData)
        }
      )
    }
  },
  updateCensus : function(reaction) {
    const jsonData = {
      action : "read",
      target : CensusFile
    }
    let censusData = TiCu.json(jsonData)
    let msg = reaction.message
    let userId
    for (const id of reaction.users.keyArray()) {
      if (id !== PUB.users.tipouitaculte.id) {
        userId = id
        reaction.remove(userId)
        break
      }
    }
    if (!censusData.members.includes(userId)) {
      censusData.members.push(userId)
      jsonData.action = "write"
      jsonData.content = censusData
      TiCu.json(jsonData)
      msg.edit(createUpdateEmbed(msg.embeds[0], true))
    }
    if (reaction.emoji.name === "✅") {
      tipoui.fetchMember(userId).then(member => {
        if (!member.roles.get(PUB.roles.vote.id)) {
          member.addRole(PUB.roles.vote.id).then(() => member.send("Vous avez récupéré le rôle de votant-e"))
        }
      })
    } else {
      tipoui.fetchMember(userId).then(member => {
        if (member.roles.get(PUB.roles.vote.id)) {
          member.removeRole(PUB.roles.vote.id).then(() => member.send("Vous avez abandonné le rôle de votant-e"))
        }
      })
    }
  },
  collector : undefined
}
