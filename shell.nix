# Lets setup some definitions
let
    # niv should pin your current thing inside ./nix/sources
    # here we go and get that pinned version so we can pull packages out of it
    sources = import ./settings/nix/sources.nix;
    normalPackages = import sources.nixpkgs {};
    
# using those definitions
in
    # create a shell
    normalPackages.mkShell {
        
        # inside that shell, make sure to use these packages
        buildInputs = [
            normalPackages.nodejs
            # basic commandline tools
            normalPackages.zsh
            normalPackages.zsh-syntax-highlighting
            normalPackages.oh-my-zsh
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
            export NIX_PATH="nixpkgs=${sources.nixpkgs}:."
            
            # pass the zsh data to zsh (roundabout way)
            mkdir -p ./settings/.cache
            echo "${normalPackages.zsh-syntax-highlighting}/share/zsh-syntax-highlighting/highlighters" > ./settings/.cache/.zsh-syntax-highlighting-dir.cleanable
            echo "${normalPackages.oh-my-zsh}" > ./settings/.cache/.normalPackages.oh-my-zsh-dir.cleanable
            
            # start zsh
            nix-shell --pure --command zsh
            exit
        fi
        '';
    }