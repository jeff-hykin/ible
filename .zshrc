# don't let zsh update itself without telling all the other packages 
# instead use nix to update zsh
DISABLE_AUTO_UPDATE="true"
DISABLE_UPDATE_PROMPT="true"

# load custom user settings
# if user just wants to add something (like an export) and not replace everything
# they should use ./settings/shell_startup/.nosync.exports.sh 
CUSTOM_USER_SETTINGS="./.nosync.zshrc"
if [[ -f "$CUSTOM_USER_SETTINGS" ]]; then
    source "$CUSTOM_USER_SETTINGS"
#
# if no custom user settings, then use epic defaults 👌
# 
else 
    # See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
    ZSH_THEME="robbyrussell" # default
    
    export ZSH="$(cat ./settings/.cache/.normalPackages.oh-my-zsh-dir.cleanable)/share/oh-my-zsh"
    source "$ZSH/oh-my-zsh.sh"
    
    export ZSH_HIGHLIGHT_HIGHLIGHTERS_DIR="$(cat ./settings/.cache/.zsh-syntax-highlighting-dir.cleanable)"
    # enable syntax highlighing
    source "$ZSH_HIGHLIGHT_HIGHLIGHTERS_DIR/../zsh-syntax-highlighting.zsh"
    
    
    # Set Spaceship ZSH as a prompt
    autoload -U promptinit; promptinit
    prompt spaceship
    
    # enable auto complete
    autoload -Uz compinit
    compinit

    autoload bashcompinit
    bashcompinit
fi

# 
# find and run all the startup scripts in alphabetical order
# 
for file in ./settings/shell_startup/*
do
    # make sure its a file
    if [[ -f $file ]]; then
        source $file
    fi
done