# Lets setup some definitions
let

    # pick the exact commit on the nixpkg repository we want to use
    # that way theres no ambiguity about the versions of tools we're using
    commitHash = "a332da8588aeea4feb9359d23f58d95520899e3c";
    # download that verion of the repo, and save the filepath to it
    nixpkgsSource = builtins.fetchTarball {
        url = "https://github.com/NixOS/nixpkgs/archive/${commitHash}.tar.gz";
        
        # the sha256 is optional, it makes sure that the commit: a332da8588aeea4feb9359d23f58d95520899e3c
        # isn't corrupt
        sha256 = "18hlja5syv3xpi14c07h9lrn1cchq2azmj06fyalq52vl064nx75";
    };
    # use the filepath to import all the packages, and send a config
    normalPackages = builtins.import nixpkgsSource {
        config = {
            allowUnfree = true;
        };
    };
    
# using those definitions
in
    # create a shell
    normalPackages.mkShell {
        # /nix/store/qpd6jzynmnxliipnpq0n2rrfaax4dpfk-spaceship-prompt-3.11.2
        # ./share/zsh/themes/spaceship.zsh-theme
        # /nix/store/7xxjsp94hy5j6qkf6bk87sx51s8avihn-oh-my-zsh-2020-08-20
        # ./share/oh-my-zsh/themes/
        # inside that shell, make sure to use these packages
        buildInputs = [
            normalPackages.nodejs
            # basic commandline tools
            normalPackages.zsh
            normalPackages.zsh-syntax-highlighting
            normalPackages.oh-my-zsh
            normalPackages.spaceship-prompt
            normalPackages.ripgrep
            normalPackages.which
            normalPackages.git
            normalPackages.colorls
            normalPackages.tree
            normalPackages.less
            normalPackages.niv
            normalPackages.cacert # needed for niv
            normalPackages.nix    # needed for niv
            # 
            # how to add packages?
            # 
            # you can search for them here: https://search.nixos.org/packages
            # to find them in the commandline use:
            #     nix-env -qP --available PACKAGE_NAME_HERE | cat
            # ex:
            #     nix-env -qP --available opencv
            # to add those specific versions find the nixpkgs.STUFF 
            # and add it here^ as normalPackages.STUFF
            # ex find:
            #     nixpkgs.python38Packages.opencv3  opencv-3.4.8
            # ex add:
            #     normalPackages.python38Packages.opencv3
            # 
            # NOTE: some things (like setuptools) just don't show up in the 
            # search results for some reason, and you just have to guess and check 🙃 
        ];
        
        shellHook = ''
        # we don't want to give nix or other apps our home folder
        if [[ "$HOME" != "$(pwd)" ]] 
        then
            # copy in gitconfig before changing home var 
            cp ~/.gitconfig ./.gitconfig
            
            # so make the home folder the same as the project folder
            export HOME="$(pwd)"
            # make it explicit which nixpkgs we're using
            export NIX_PATH="nixpkgs=${nixpkgsSource}:."
            
            
            # 
            # give paths to zsh
            # 
            paths_passthrough="./settings/.cache/package-paths"
            mkdir -p "$paths_passthrough"
            echo "${normalPackages.spaceship-prompt}" > "$paths_passthrough/spaceship-prompt.cleanable"
            echo "${normalPackages.zsh-syntax-highlighting}" > "$paths_passthrough/zsh-syntax-highlighting.cleanable"
            echo "${normalPackages.oh-my-zsh}" > "$paths_passthrough/oh-my-zsh.cleanable"
            echo "${normalPackages.zsh}" > "$paths_passthrough/zsh.cleanable"
            
            # start zsh
            nix-shell --pure --command zsh
            exit
        fi
        '';
    }