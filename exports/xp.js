const XPLINEAR = 179
const XPJUMPPOWER = 1.5
const XPLEVELJUMPRATE = 5

const XPPERCHARACTER = 0.027
const CHARACTERSJUMPRATE = 400
const CHARACTERJUMPPOWER = 1.5
const XPREACTION = 0.05
const XPREACTEDTO = 0.01

const ROLEMULTIPLICATOR = 0.4
const DISCORDTAINMENTMULTIPLIER = 0.01

const LEVELMAX = 100

const multiplierRoles = [
  PUB.tipoui.armu,
  PUB.tipoui.nitro,
  PUB.tipoui.utip
]

const whitelistCategories = Object.values(PUB.xpWhitelistCategories)
const blackListChannels = Object.values(PUB.xpBlacklistChannels)

const MemberXP = DB.define('memberxp', {
    id: {
        type: SequelizeDB.STRING,
        allowNull: false,
        primaryKey: true
    },
    xp: {
        type: SequelizeDB.FLOAT
    },
    level: {
        type: SequelizeDB.INTEGER
    },
    activated: {
        type: SequelizeDB.BOOLEAN
    }
}, {
    timestamps: false
});

function xpByLevel(level) {
    return Math.floor(XPLINEAR * Math.pow(Math.ceil(level/XPLEVELJUMPRATE), XPJUMPPOWER) * level);
}

const levelToXP = []
for (let i=0;i<LEVELMAX;i++) {
    levelToXP[i] = xpByLevel(i)
}

function calculateLevelByXp(xp) {
    let level;
    for (level = 0; level < 50; level++) {
        if (xp < levelToXP[level]) break;
    }
    level--
    return level
}

function systemAccessAuthorised(msg) {
    return msg.channel.type === 'text' && // is in a GuildChannel
      msg.guild.id === PUB.tipoui.commu && // is in Tipoui Guild
      whitelistCategories.includes(msg.channel.parent.id) && // is in the right categories
      !blackListChannels.includes(msg.channel.id) // is not in the excluded channels
}

module.exports = {
    updateXp: function (type, value, target) {
        let booster = 1
        for (const role of multiplierRoles) {
            if (tipoui.members.get(target).roles.get(role)) booster = booster + ROLEMULTIPLICATOR
        }
        value = value * booster
        MemberXP.findOrCreate({where: {id: target}, defaults: {level: 0, xp: 0, activated: true}}).then(
            ([entry, created]) => {
                if (created) {
                    TiCu.Log.XP.newEntry(entry)
                }
                if (entry.activated) {
                    const newLevel = calculateLevelByXp(entry.xp)
                    MemberXP.update({
                        xp: entry.xp + (type === 'add' ? value : -value),
                        level: newLevel
                    }, {
                        where: {
                            id: target
                        },
                        returning: true
                    }).then(
                        ([numberUpdated, entries]) => {
                            if (numberUpdated !== 1) {
                                TiCu.Log.XP.error(this.errorTypes.MULTIPLEUPDATE, target)
                            } else {
                                if (newLevel !== entry.level) {
                                    TiCu.Log.XP.levelChange(entries[0], entry.level)
                                }
                            }
                        }
                    )
                }
            }
        )
    },
    processXpFromMessage: function (type, msg) {
        if (systemAccessAuthorised(msg)) {
            const charNb = msg.content.length
            const xp = charNb * XPPERCHARACTER * Math.pow(Math.ceil(charNb / CHARACTERSJUMPRATE), CHARACTERJUMPPOWER) * (msg.channel.parent.id === PUB.xpWhitelistCategories.discordtainment ? DISCORDTAINMENTMULTIPLIER : 1)
            this.updateXp(type, xp, msg.author.id)
        }
    },
    reactionXp: function (type, reaction, usr) {
        if (systemAccessAuthorised(reaction.message)) {
            if (usr.id !== reaction.message.author.id && !usr.bot && !reaction.message.author.bot) {
                this.updateXp(type, XPREACTION, usr.id)
                this.updateXp(type, XPREACTEDTO, reaction.message.author.id)
            }
        }
    },
    getMember: function(id) {
        return MemberXP.findByPk(id)
    },
    getXpByLevel: function(level) {
        return xpByLevel(level)
    },
    changeMemberStatus: function(target, activated) {
        MemberXP.update({
            activated: activated
        }, {
            where: {
                id: target
            },
            returning: true
        }).then(
          ([numberUpdated, entries]) => {
              if (numberUpdated !== 1) {
                  TiCu.Log.XP.error(this.errorTypes.MULTIPLEUPDATE, target)
              } else {
                  TiCu.Log.XP.statusChange(entries[0])
              }
          }
        )
    },
    resetEveryOneXp: function() {
        MemberXP.update({
            xp: 0,
            level: 0
        }, {
            where: {}
        })
    },
    errorTypes: {
        MULTIPLEUPDATE: 'multipleUpdate'
    }
}
