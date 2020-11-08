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
    # 
    # import paths from nix
    # 
    # this var needs to match the one inside shell.nix
    paths_passthrough="./settings/.cache/package-paths"
    mkdir -p "$paths_passthrough"
    spaceship_prompt__path="$(cat "$paths_passthrough/spaceship-prompt.cleanable")"
    zsh_syntax_highlighting__path="$(cat "$paths_passthrough/zsh-syntax-highlighting.cleanable")"
    oh_my_zsh__path="$(cat "$paths_passthrough/oh-my-zsh.cleanable")"
    zsh__path="$(cat "$paths_passthrough/zsh.cleanable")"
    
    # 
    # set fpath for zsh
    # 
    local_zsh="$PWD/settings/zsh.nosync/site-functions/"
    mkdir -p "$local_zsh"
    # export fpath=""
    export fpath=("$local_zsh")
    export fpath=("$oh_my_zsh__path"/share/oh-my-zsh/functions $fpath)
    export fpath=("$oh_my_zsh__path"/share/oh-my-zsh/completions $fpath)
    export fpath=("$zsh__path"/share/zsh/site-functions $fpath)
    export fpath=("$zsh__path"/share/zsh/*/functions $fpath)
    
    # See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
    ZSH_THEME="robbyrussell" # default
    
    # 
    # add spaceship-prompt theme
    # 
    ln -s "$spaceship_prompt__path/lib/spaceship-prompt/spaceship.zsh" "$local_zsh/prompt_spaceship_setup"
    
    export ZSH="$oh_my_zsh__path/share/oh-my-zsh"
    source "$ZSH/oh-my-zsh.sh"
    
    # 
    # enable syntax highlighing
    # 
    export ZSH_HIGHLIGHT_HIGHLIGHTERS_DIR="$zsh_syntax_highlighting__path/share/zsh-syntax-highlighting/highlighters"
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