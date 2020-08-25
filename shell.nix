# Lets setup some definitions
let
    # niv should pin your current thing inside ./nix/sources
    # here we go and get that pinned version so we can pull packages out of it
    sources = import ./nix/sources.nix;
    normalPackages = import sources.nixpkgs {};
    
    # niv init
    # niv update nixpkgs -b nixpkgs-unstable
    
# using those definitions
in
    # create a shell
    normalPackages.mkShell {
        
        # inside that shell, make sure to use these packages
        buildInputs = [
            normalPackages.nodejs
            # basic commandline tools
            normalPackages.ripgrep
            normalPackages.which
            normalPackages.git
            normalPackages.less
            normalPackages.tree
            normalPackages.colorls
            normalPackages.niv
            # seach: nix -qA your-package-name
            # show all packages: nix-env -qa -P
        ];
        
        
        shellHook = ''
        echo "Loading up the shell!"
        
        # asthetics
        PS1="∫ "
        alias ls="ls --color"
        
        #
        # setup local commands
        #
        # add commands to path
        PATH="$PWD/commands:$PATH"
        # ensure commands folder exists
        if [[ -d "./commands" ]]; then
            false;
        else
            mkdir ./commands
        fi
        # create the "commands" command if it doesnt exist
        if [[ -f "./commands/commands" ]]; then
            false;
        else
            echo "#!/usr/bin/env bash
            ls -1 ./commands | sed 's/^/    /'
            " > "./commands/commands"
        fi
        
        #
        # setup node modules
        #
        echo "checking node modules"
        # add the git hook
        echo "install" >> .git/hooks/post-merge
        chmod u+x .git/hooks/post-merge

        # make sure commands are executable
        chmod -R u+x "./commands"
        
        # install node modules if needed
        install
        
        # display the commands
        echo ""
        echo ""
        echo "available commands:"
        commands
        alias help="./commands/help" # overrides default bash "help"
        echo ""
        
        
        '';
        
        # Environment variables
        # HELLO="world";
        
        # # note the ./. acts like $PWD
        # FOO = toString ./. + "/foobar";
    }
