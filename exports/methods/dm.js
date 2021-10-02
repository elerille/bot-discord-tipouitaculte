const dmFile = "private/dm.json"

module.exports = {
    getData: function() {
        const jsonAction = {
            action: "read",
            target: dmFile
        }
        return TiCu.json(jsonAction)
    },
    writeData: function(data) {
        const jsonAction = {
            action: "write",
            target: dmFile,
            content: data
        }
        return TiCu.json(jsonAction)
    },
    addPref: function(idMembre, typeAsked) {
        const dmData = TiCu.DM.getData()
        if (dmData) {
            for (const type of ["on", "off", "ask"]) {
                dmData[type] = dmData[type].filter(v => v !== idMembre)
            }
            dmData[typeAsked].push(idMembre)
            TiCu.DM.writeData(dmData)
            return 0
        }
        return 1
    },
    getPref: function(idMembre) {
        const dmData = TiCu.DM.getData()
        if (dmData) {
            for (const type of ["on", "off", "ask"]) {
                if (dmData[type].includes(idMembre)) {
                    return type
                }
            }
            return "on"
        }
        return "on"
    }
}