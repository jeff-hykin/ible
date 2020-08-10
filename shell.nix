# Lets setup some definitions
let
    # the niv tool should pin your current thing inside ./nix/sources
    # here we go and get that pinned version so we can pull packages out of it
    sources = import ./nix/sources.nix;
    normalPackages = import sources.nixpkgs {};

# using those definitions
in
    # create a shell
    normalPackages.mkShell {
        
        # inside that shell, make sure to use these packages
        buildInputs = [
            normalPackages.nodejs-12_x
            normalPackages.bashInteractive
        ];
        
    }
