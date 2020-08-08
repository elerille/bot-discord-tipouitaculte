const newMembersFile = "private/newMembers.json"
const TIME_TO_NOTIFY = 14 * DAY
const TIME_TO_KICK = 28 * DAY

const NB_MAX_ARRIVALS = 3
const ARRIVALS_PERIOD = 2 * 60 * 1000

module.exports = {
  getData: function() {
    const jsonAction = {
      action: "read",
      target: newMembersFile
    }
    return TiCu.json(jsonAction)
  },
  writeData: function(data) {
    const jsonAction = {
      action: "write",
      target: newMembersFile,
      content: data
    }
    return TiCu.json(jsonAction)
  },
  getMembers: function() {
    const membersData = TiCu.NewMembers.getData()
    if (membersData) {
      return membersData.members
    }
    return {}
  },
  addMember: function(id) {
    const membersData = TiCu.NewMembers.getData()
    const member = tipoui.members.get(id)
    if (member && membersData) {
      membersData.members[id] = {
        id: id,
        joinedTimestamp : member.joinedTimestamp,
        notified: false
      }
      TiCu.NewMembers.writeData(membersData)
      return true
    }
    return false
  },
  removeMember: function(id) {
    const membersData = TiCu.NewMembers.getData()
    if (membersData && membersData.members[id]) {
      delete membersData.members[id]
      TiCu.NewMembers.writeData(membersData)
    }
  },
  notifiedMember: function(id) {
    const membersData = TiCu.NewMembers.getData()
    if (membersData) {
      membersData.members[id].notified = true
      TiCu.NewMembers.writeData(membersData)
    }
  },
  getMembersToNotify: function () {
    const membersData = TiCu.NewMembers.getData()
    let res = []
    if (membersData) {
      const timestamp = Date.now() - TIME_TO_NOTIFY
      for (const member of Object.values(membersData.members)) {
        if (member.joinedTimestamp < timestamp && !member.notified) {
          res.push(member.id)
        }
      }
    }
    return res
  },
  getMembersToKick: function () {
    const membersData = TiCu.NewMembers.getData()
    let res = []
    if (membersData) {
      const timestamp = Date.now() - TIME_TO_KICK
      for (const member of Object.values(membersData.members)) {
        if (member.joinedTimestamp < timestamp && member.notified) {
          res.push(member.id)
        }
      }
    }
    return res
  },
  notificationAndKick: function () {
    const notify = TiCu.NewMembers.getMembersToNotify()
    const kick = TiCu.NewMembers.getMembersToKick()
    for (const memberId of notify) {
      if (tipoui.members.get(memberId)) {
        tipoui.channels.get(PUB.salons.debug.id).send(`<@${memberId}>, tu n'as pas encore fait ta présentation ou celle-ci n'a pas encore été validée depuis ton arrivée il y a deux semaines. Je te laisse lire les Saintes Règles, rajouter tes pronoms dans ton pseudo et nous faire une ptite présentation dans le salon qui va bien (ou bien la compléter) :heart:`)
        TiCu.NewMembers.notifiedMember(memberId)
        TiCu.Log.NewMembers(memberId, true)
      } else {
        TiCu.NewMembers.removeMember(memberId)
      }
    }
    for (const memberId of kick) {
      const tipouiMember = tipoui.members.get(memberId)
      if (tipouiMember) {
        tipouiMember.send(`<@${memberId}>, tu n'as pas encore fait ta présentation ou celle-ci n'a pas encore été validée depuis ton arrivée il y a quatre semaines. Je suis donc dans l'obligation de te retirer du serveur.\n Cela dit, rien n'est définitif et tu peux revenir si et quand tu le souhaites !`)
        TiCu.NewMembers.removeMember(memberId)
        tipouiMember.kick()
        TiCu.Log.NewMembers(memberId, false)
      } else {
        TiCu.NewMembers.removeMember(memberId)
      }
    }
  },
  arrival: function(memberId) {
    TiCu.NewMembers.addMember(memberId)
    const now = Date.now()
    const lastArrivals = Object.values(TiCu.NewMembers.getMembers()).filter((value) => value.joinedTimestamp > now - ARRIVALS_PERIOD)
    if (lastArrivals.length > NB_MAX_ARRIVALS) {
      TiCu.Commands['raid'].run()
      for (const member of lastArrivals) {
        const tipouiMember = tipoui.members.get(member.id)
        tipouiMember.ban()
        vigi.channels.get(PUB.servers.vigi.grandeTour).send(`Ban de ${member.user.username} sur suspission de raid`)
      }
    }
  }
}