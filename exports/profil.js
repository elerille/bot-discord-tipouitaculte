const MemberProfilField = DB.define('memberprofilfield', {
  id: {
    type: SequelizeDB.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  idMember: {
    type: SequelizeDB.STRING,
    allowNull: false,
  },
  name: {
    type: SequelizeDB.STRING
  },
  value: {
    type: SequelizeDB.STRING
  }
}, {
  timestamps: false
});

const MemberProfil = DB.define('memberprofil', {
  id: {
    type: SequelizeDB.STRING,
    allowNull: false,
    primaryKey: true
  },
  avatar: {
    type: SequelizeDB.STRING
  },
  color: {
    type: SequelizeDB.STRING
  },
  titre: {
    type: SequelizeDB.STRING
  },
  citation: {
    type: SequelizeDB.STRING
  }
}, {
  timestamps: false
});

const urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

function updateBaseProfil(name, value, targetId, msg) {
  let newValue = {}
  newValue[name] = value
  MemberProfil.update(
    newValue,
    {
      where: {
        id: targetId
      },
      returning: false
    }
  ).then(() => msg.react("✅"))
}

function updateProfilField(name, value, targetId, msg) {
  MemberProfilField.update(
    {
      value: value
    },
    {
      where: {
        idMember: targetId,
        name: name
      },
      returning: false
    }
  ).then(() => msg.react("✅"))
}

function deleteBaseProfilField(name, targetId, msg) {
  let newValue = {}
  newValue[name] = ''
  MemberProfil.update(
    newValue,
    {
      where: {
        id: targetId
      },
      returning: false
    }
  ).then(() => msg.react("✅"))
}

function deleteProfilField(name, targetId, msg) {
  MemberProfilField.destroy(
    {
      where: {
        idMember: targetId,
        name: name
      }
    }
  ).then(() => msg.react("✅"))
}

module.exports = {
  setValue: function(name, value, targetId, msg) {
    MemberProfil.findOrCreate({where: {id: targetId}}).then(
      ([entry, created]) => {
        if (created) {
          TiCu.Log.Profil.newEntry(entry)
        }
        switch(name.toLowerCase()) {
          case 'color':
          case 'couleur':
            value = value.toLowerCase()
            if (value.match(colorHexa)) {
              updateBaseProfil('color', value, targetId, msg)
            } else TiCu.Log.Error('profil', 'La valeur de couleur est invalide', msg)
            break
          case 'avatar':
          case 'vava':
            if (value.match(urlRegex)) {
              updateBaseProfil('avatar', value, targetId, msg)
            } else TiCu.Log.Error('profil', 'La valeur d\'avatar est invalide (Veuillez entrer une URL commençant par http ou https)', msg)
            break
          case 'titre':
          case 'title':
            updateBaseProfil('titre', value, targetId, msg)
            break
          case 'citation':
            updateBaseProfil(name, value, targetId, msg)
            break
          default:
            MemberProfilField.findOrCreate({where: {idMember: entry.id, name: name}, defaults: {value: value}}).then(
              ([entryField, created]) => {
                if (created) {
                  TiCu.Log.Profil.newField(entryField, targetId)
                  msg.react("✅")
                } else {
                  updateProfilField(name, value, targetId, msg)
                }
              }
            )
            break
        }
      }
    )
  },
  sendProfilEmbed: function(target, msg) {
    MemberProfil.findOrCreate({where: {id: target.id}}).then(
      ([entry, created]) => {
        if (created) {
          TiCu.Log.Profil.newEntry(entry)
        }
        MemberProfilField.findAll({where: {idMember: entry.id}}).then(
          entriesField => {
            entry.fields = {}
            if (entriesField.length) {
              for (const entryField of entriesField) {
                entry.fields[entryField.name] = entryField.value
              }
            }
            let embed = new DiscordNPM.RichEmbed()
              .setAuthor(`Profil de ${target.displayName}`, target.user.avatarURL)
            entry.avatar ? embed.setImage(entry.avatar) : embed.setImage(target.user.avatarURL)
            entry.color ? embed.setColor(entry.color) : embed.setColor(target.displayColor)
            if (entry.titre) embed.setTitle(entry.titre)
            if (entry.citation) embed.setDescription(entry.citation)
            for (const field of Object.keys(entry.fields)) {
              embed.addField(field, entry.fields[field], true)
            }
            msg.channel.send(embed).then(() => {
              TiCu.Log.Commands.Profil(msg, target)
            })
          }
        )
      }
    )
  },
  deleteValue: function(name, targetId, msg) {
    MemberProfil.findOrCreate({where: {id: targetId}}).then(
      ([entry, created]) => {
        if (created) {
          TiCu.Log.Profil.newEntry(entry)
        }
        switch(name.toLowerCase()) {
          case 'color':
          case 'couleur':
            deleteBaseProfilField('color', targetId, msg)
            break
          case 'avatar':
          case 'vava':
            deleteBaseProfilField('avatar', targetId, msg)
            break
          case 'titre':
          case 'title':
            deleteBaseProfilField('titre', targetId, msg)
            break
          case 'citation':
            deleteBaseProfilField('citation', targetId, msg)
            break
          default:
            deleteProfilField(name, targetId, msg)
            break
        }
      }
    )
  },
  sendFieldValue: function(name, targetId, msg) {
    MemberProfil.findOrCreate({where: {id: targetId}}).then(
      ([entry, created]) => {
        if (created) {
          TiCu.Log.Profil.newEntry(entry)
        }
        switch(name.toLowerCase()) {
          case 'color':
          case 'couleur':
            msg.channel.send(`Couleur : ${entry.color}`)
            break
          case 'avatar':
          case 'vava':
            msg.channel.send(`Avatar : ${entry.avatar}`)
            break
          case 'titre':
          case 'title':
            msg.channel.send(`Titre : ${entry.titre}`)
            break
          case 'citation':
            msg.channel.send(`Citation : ${entry.citation}`)
            break
          default:
            MemberProfilField.findAll({where: {idMember: entry.id, name: name}}).then(
              entriesField => {
                if (entriesField) {
                  msg.channel.send(`${entriesField[0].name} : ${entriesField[0].value}`)
                } else {
                  TiCu.Log.Error('profil', 'L\'entrée demandée n\'existe pas pour ce compte')
                }
              }
            )
            break
        }
      }
    )
  },
  getBaseMemberProfil: function(targetId) {
    return MemberProfil.findByPk(targetId)
  }
}