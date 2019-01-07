const menus = {
    main: `
      rave [command] <options>
  
      create .............. create rave sample apps
      remove .............. remove rave sample apps
      init ............ run platform specific commands
      set ................. set api keys
      help ............... show help menu for a command
      version ............. show current version of cli`,

    help: `
      rave help [command]

      create - help on how to use the create command
      init - help on how to use the init command
      set - help on how to use the set command
      remove - help on how to use the remove command
      version -  help on how to use the version command`,
    
    init: `
      rave init [command] [heroku repo url]
      
      heroku - create a heroku app in the current directory
      
      git - initialize a git repo in the current directory and add heroku remote repo
    `,

    set: `
      rave set <options>
      
      --SANDBOX_PUBLIC_KEY .............. set your rave public key in the environment variable

      --SANDBOX_SECRET_KEY .............. set your rave secret key in the environment variable
    `,  
    create: `
      rave create <options> value

      --app ............ create a sample app. It can assume any of the following values:

      transfer, ..... create a sample transfer app

      3dsecure, ..... create a sample 3dsecure app

      split, ..... create a sample split payments app

      tokenized, ..... create a sample tokenized app
      `,
    remove: `
      rave remove <options> value

      --app ............ create a sample app. It can assume any of the following values:

      transfer, ...... create a sample transfer app

      3dsecure, ..... create a sample 3dsecure app

      split, ...... create a sample split payments app

      tokenized, ...... create a sample tokenized app
      `,
}

module.exports = (args) => {
    // show help for a command or just show general help
    const subCommand = args._[0] === 'help' ? args._[1] : args._[0];

    console.log(menus[subCommand] || menus.main)
}