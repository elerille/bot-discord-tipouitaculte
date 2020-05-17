const quizzFile = "private/quizz.json"

module.exports = {
  getData: function() {
    const jsonAction = {
      action: "read",
      target: quizzFile
    }
    return TiCu.json(jsonAction)
  },
  writeData: function(data) {
    const jsonAction = {
      action: "write",
      target: quizzFile,
      content: data
    }
    return TiCu.json(jsonAction)
  },
  getMembers: function() {
    const quizzData = TiCu.Quizz.getData()
    if (quizzData) {
      const teams = Object.keys(quizzData.teams)
      const res = {}
      for (const team of teams) {
        res[team] = quizzData.teams[team].members
      }
      return res
    }
    return {}
  },
  addMember: function(id, team) {
    const resRegMember = id.match(/(<@)?([0-9]+)(>)?/)
    if (!resRegMember) return 3
    const memberId = resRegMember[2]
    const quizzData = TiCu.Quizz.getData()
    if (tipoui.members.get(memberId)) {
      if (quizzData && quizzData.teams[team]) {
        for (const teamObject of Object.values(quizzData.teams)) {
          if (teamObject.members.includes(memberId)) {
            return 1
          }
        }
        quizzData.teams[team].members.push(memberId)
        TiCu.Quizz.writeData(quizzData)
        return 0
      }
      return 2
    } else return 3
  },
  removeMember: function(id) {
    const resRegMember = id.match(/(<@)?([0-9]+)(>)?/)
    if (!resRegMember) return false
    const quizzData = TiCu.Quizz.getData()
    if (quizzData) {
      for (const teamName of Object.keys(quizzData.teams)) {
        quizzData.teams[teamName].members = quizzData.teams[teamName].members.filter(value => value !== resRegMember[2])
      }
      TiCu.Quizz.writeData(quizzData)
      return true
    }
    return false
  },
  getPoints: function() {
    const quizzData = TiCu.Quizz.getData()
    if (quizzData) {
      const teams = Object.keys(quizzData.teams)
      const res = {}
      for (const team of teams) {
        res[team] = quizzData.teams[team].points
      }
      return res
    }
    return {}
  },
  changePoints: function(team, operator, value) {
    const quizzData = TiCu.Quizz.getData()
    if (quizzData && quizzData.teams[team]) {
      value = value.replace(",", ".")
      if (!isNaN(value)) {
        if (operator === "+") {
          quizzData.teams[team].points += Number(value)
          TiCu.Quizz.writeData(quizzData)
          return 0
        } else if (operator === "-") {
          quizzData.teams[team].points -= Number(value)
          TiCu.Quizz.writeData(quizzData)
          return 0
        } else return 1
      } else return 2
    } return 3
  },
  renameTeam: function(oldName, newName) {
    const quizzData = TiCu.Quizz.getData()
    if (quizzData && quizzData.teams[oldName]) {
      quizzData.teams[newName] = quizzData.teams[oldName]
      delete quizzData.teams[oldName]
      TiCu.Quizz.writeData(quizzData)
      return true
    }
    return false
  }
}