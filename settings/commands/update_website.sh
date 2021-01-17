npm run build
function git_sync { # git push && git pull
    args="$@"
    if [[ $args = "" ]]; then
        git add -A && git commit -m "-";git pull --no-edit;git push
    else
        git add -A && git commit -m "$args";git pull --no-edit;git push
    fi
}
git_sync build
backup_repo="/home/jeff/repos/ilab-database/backups.nosync"
ssh -t root@134.209.57.254 "cd /root/projs/iilvd-online; git pull"