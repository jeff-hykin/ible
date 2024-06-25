#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.42.1"; : --% ' |out-null <#'; }; version="$(dv)"; deno="$HOME/.deno/$version/bin/deno"; if [ -x "$deno" ]; then  exec "$deno" run --no-npm -q -A "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run --no-npm -q -A "$0" "$@";  fi; bin_dir="$HOME/.deno/$version/bin"; exe="$bin_dir/deno"; has () { command -v "$1" >/dev/null; } ;  if ! has unzip; then if ! has apt-get; then  has brew && brew install unzip; else  if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  sudo apt-get install unzip -y; fi; elif has doas; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  doas apt-get install unzip -y; fi; fi;  fi;  fi;  if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  repo="denoland/deno"; if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else :;  case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") repo="LukeChannings/deno-arm64" target="linux-arm64" ;; "Linux armhf") echo "deno sadly doesn't support 32-bit ARM. Please check your hardware and possibly install a 64-bit operating system." exit 1 ;; *) target="x86_64-unknown-linux-gnu" ;; esac; fi; deno_uri="https://github.com/$repo/releases/download/v$version/deno-$target.zip"; exe="$bin_dir/deno"; if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if ! curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; then if ! wget --output-document="$exe.zip" "$deno_uri"; then echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them. Please install one of them, otherwise I have no way to install the missing deno version needed to run this code"; exit 1; fi; fi; unzip -d "$bin_dir" -o "$exe.zip"; chmod +x "$exe"; rm "$exe.zip"; exec "$deno" run --no-npm -q -A "$0" "$@"; #>}; $DenoInstall = "${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run --no-npm -q -A "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}`;
import * as http from "node:http"
import * as fs from "node:fs"
import * as path from "node:path"
import * as os from "node:os"
import * as process from "node:process"
import minimist from "npm:minimist"
// import minimist from "./node_modules/minimist/index.js"

import { FileSystem } from "https://deno.land/x/quickr@0.6.67/main/file_system.js"

import { mimeTypes, videoExtensions } from "./src/utils.js"
import * as utils from "./src/utils.js"

let thisFolder = FileSystem.thisFolder
const location1Info = await FileSystem.info(`${FileSystem.thisFolder}/package.json`)
if (!location1Info.isFile) {
    thisFolder = `${FileSystem.thisFolder}/../ible`
}

// Parse command-line arguments
const realArgs = process.argv.slice(2)
if (realArgs[0] === "--help") {
    console.log(`
Usage: ible [options]

Options:
    --help            Show this help message
    --version         Show the version number
    --hostname, -h    The hostname to listen on (default: 127.0.0.1)
    --port, -p        The port to listen on (default: 3000)
`)
    process.exit(0)
} else if (realArgs[0] === "--version") {
    console.log(`v1.0.8`)
    process.exit(0)
}
const args = minimist(realArgs, {
    default: {
        hostname: "127.0.0.1",
        port: 3000,
    },
    alias: {
        h: "hostname",
        p: "port",
    },
})
const hostname = args.hostname
const port = args.port
const baseDirectory = path.join(thisFolder, "docs")
const videoDirectory = FileSystem.makeAbsolutePath(path.join(os.homedir(), "videos"))
const cache = {
    videoPathsString: "[]",
    localVideosHash: "",
}

// 
// start watching the videos folder 
// 
const getVideoPaths = async (videoDirectory)=>{
    const list = await FileSystem.listFilePathsIn(
        videoDirectory,
        {
            recursively: true,
            shouldntInclude: (each)=>{
                const ending = each.split(".").slice(-1)[0]
                if (each.includes(".") && videoExtensions.includes(ending)) {
                    return false
                }
                return true
            },
        }
    )
    return list.map(each=>each.slice(videoDirectory.length+1))
}
const refreshVideoList = async ()=>{
    cache.videoPathsString = JSON.stringify(await getVideoPaths(videoDirectory))
    cache.localVideosHash = utils.quickHash(cache.videoPathsString)
}
// 5000 = repeat every (5000ms + duration of function call)
new utils.DynamicInterval().setRate(5000).onInterval(()=>{
    refreshVideoList()
}).start()

//
// setup the server
//
console.log(`# `)
console.log(`# Server running at http://${hostname}:${port}/`)
console.log(`# `)
console.log()
console.log(`Put your videos somewhere in here:\n${videoDirectory}`)
Deno.serve({ port, hostname }, async (request) => {
    const urlPath = (new URL(request.url)).pathname
    console.debug(`urlPath is:`,urlPath)
    let filePath = path.join(baseDirectory, urlPath === "/" ? "index.html" : urlPath)
    
    // 
    // asking for a video file
    // 
    if (urlPath.startsWith("/videos/")) {
        let videoPath = path.join(videoDirectory, urlPath.replace(/^\/videos\//, ""))
        if (fs.existsSync(videoPath)) {
            filePath = videoPath
        }
    // 
    // asking for API
    // 
    } else if (urlPath.startsWith("/backend/")) {
        // 
        // asking for change hash
        // 
        if (urlPath.startsWith("/backend/video_change_hash/")) {
            return new Response(JSON.stringify(cache.localVideosHash), {status: 200})
        // 
        // asking for list of videos
        // 
        } else if (urlPath.startsWith("/backend/list_videos/")) {
            return new Response(cache.videoPathsString, {status: 200})
        // 
        // asking to give a video an id
        // 
        } else if (urlPath.startsWith("/backend/give_video_id/")) {
            let videoPath = urlPath.slice("/backend/give_video_id/".length)
            if (videoPath.startsWith("/videos/")) {
                videoPath = videoPath.slice("/videos/".length)
            }
            if (!videoPath.includes(".")) {
                return new Response(`Sorry, the video path must include a file extension (e.g. .mp4)\n`, { status: 400 })
            }
            const videoParts = videoPath.split(".")
            const extension = videoParts.slice(-1)[0]
            // generate random ASCII string
            const videoId = utils.createVideoId()
            const newPath = `${videoParts.slice(0,-1).join(".")}.${videoId}.${extension}`
            
            try {
                await FileSystem.rename({from: `${videoDirectory}/${videoPath}`, to: `${videoDirectory}/${newPath}`})
                const response = JSON.stringify({ videoId: videoId, videoPath: `/videos/${newPath}` })
                return new Response(response, { status: 200 })
            } catch (error) {
                return new Response(`Sorry, there was a problem renaming the video: ${error}\n\n${error.stack}`, { status: 500 })
            }
        }
    }

    let extname = String(path.extname(filePath)).toLowerCase()
    let contentType = mimeTypes[extname] || "application/octet-stream"
    
    try {
        const fileContents = await Deno.readFile(filePath)
        return new Response(
            fileContents, 
            {
                status: 200,
                headers: new Headers({"content-type":contentType}),
            }
        )
    } catch (error) {
        return new Response(error.message, { status: 404 } )
    }
})

// (this comment is part of deno-guillotine, dont remove) #>