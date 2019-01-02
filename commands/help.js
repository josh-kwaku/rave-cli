const menus = {
    main: `
      rave [command] <options>
  
      create .............. create rave sample apps
      init ............ run platform specific commands
      help ............... show help menu for a command
      version ............. show current version of cli`,

    help: `
      rave help [command]

      create - help on how to use the create command
      init - help on how to use the init command
      version -  help on how to use the version command`,
    
    init: `
      rave init [command] [heroku repo url]
      
      heroku - create a heroku app in the current directory
      
      git - initialize a git repo in the current directory and add heroku remote repo
    `,

    create: `
      rave create <options> value

      --app ............ create a sample app. It can assume any of the following values:

      transfer, -t ..... create a sample transfer app

      3dsecure, -w ..... create a sample 3dsecure app

      split, -s ..... create a sample split payments app

      tokenized, -tk ..... create a sample tokenized app
      `,
}

module.exports = (args) => {
    // show help for a command or just show general help
    const subCommand = args._[0] === 'help' ? args._[1] : args._[0];

    console.log(menus[subCommand] || menus.main)
}