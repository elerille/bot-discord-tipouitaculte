command parser
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

routines
  xp
    auto
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

commands
  help
  mise en quarantaine
  raid
  color
  
