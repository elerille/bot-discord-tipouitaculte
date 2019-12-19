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
    }
}, {
    timestamps: false
});

module.exports = {
    update: function (type, value, target) {
        MemberXP.findOrCreate({where: {id: target}, defaults: {level: 0, xp: 0}}).then(
            ([entry, created]) => {
                console.log(created ? 'Entity created' : 'Entity already in DB')
                MemberXP.update({
                    xp: entry.xp + (type === 'add' ? value : -value)
                }, {
                    where: {
                        id: target
                    },
                    returning: true
                }).then(
                    ([numberUpdated, entries]) => {
                        if (numberUpdated !== 1) {
                            console.log('Something went wrong...')
                        }
                        console.log(`${target} is now at ${entries[0].xp} XP`)
                    }
                )
            }
        )
    }
}
