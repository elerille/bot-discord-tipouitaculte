const XPLINEAR = 179
const XPJUMPPOWER = 1.5
const XPLEVELJUMPRATE = 5

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
for (let i=0;i<50;i++) {
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

module.exports = {
    update: function (type, value, target) {
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
    errorTypes: {
        MULTIPLEUPDATE: 'multipleUpdate'
    }
}
