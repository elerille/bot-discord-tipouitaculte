command parser
    prefixed commands {
        nom
        description
        schema
        autorisations {
            salons
            users
        }
        trigger
        run
    }
    auto commands {
        nom
        description
        schema
        autorisations {
            salons
            users
        }
        trigger
        run
    }
    reaction responses {
        nom
        description
        emoji
        autorisations {
            message
            salons
            users
        }
        run
    }

autorisations format (bool:any,[whitelist],[blacklist])

on:message parse(prefixed) else parse(auto)
on:reaction parse(reaction)

routines
    error
        type
            send()
        log()
    log
        guild.full-log
        guild.mini-log
        guild.votes.json
        server.file-log
        process.console-log(time+msg)
    send
        auto-cut if >2000
        embed
        log()
    xp
        give
        remove
        checklevel
            autovote()
        log()
    vote
        type
        stop
        check
        log()
    role
        create
        delete
        give
        remove
        log()
    time
