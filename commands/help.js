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

      card, -c ..... create a sample card app
      
      account, -a ..... create a sample account app

      transfer, -t ..... create a sample transfer app

      webhook, -w ..... create a sample webhook app

      preauth, -p ..... create a sample preauth app

      split, -s ..... create a sample split payments app
      `,
}

module.exports = (args) => {
    // show help for a command or just show general help
    const subCommand = args._[0] === 'help' ? args._[1] : args._[0];

    console.log(menus[subCommand] || menus.main)
}