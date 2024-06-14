#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.42.1"; : --% ' |out-null <#'; }; version="$(dv)"; deno="$HOME/.deno/$version/bin/deno"; if [ -x "$deno" ]; then  exec "$deno" run -q -A "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run -q -A "$0" "$@";  fi; bin_dir="$HOME/.deno/$version/bin"; exe="$bin_dir/deno"; has () { command -v "$1" >/dev/null; } ;  if ! has unzip; then if ! has apt-get; then  has brew && brew install unzip; else  if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  sudo apt-get install unzip -y; fi; elif has doas; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  doas apt-get install unzip -y; fi; fi;  fi;  fi;  if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  repo="denoland/deno"; if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else :;  case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") repo="LukeChannings/deno-arm64" target="linux-arm64" ;; "Linux armhf") echo "deno sadly doesn't support 32-bit ARM. Please check your hardware and possibly install a 64-bit operating system." exit 1 ;; *) target="x86_64-unknown-linux-gnu" ;; esac; fi; deno_uri="https://github.com/$repo/releases/download/v$version/deno-$target.zip"; exe="$bin_dir/deno"; if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if ! curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; then if ! wget --output-document="$exe.zip" "$deno_uri"; then echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them. Please install one of them, otherwise I have no way to install the missing deno version needed to run this code"; exit 1; fi; fi; unzip -d "$bin_dir" -o "$exe.zip"; chmod +x "$exe"; rm "$exe.zip"; exec "$deno" run -q -A "$0" "$@"; #>}; $DenoInstall = "${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}`;
import * as http from "node:http"
import * as fs from "node:fs"
import * as path from "node:path"
import * as os from "node:os"
import * as process from "node:process"
import minimist from "./node_modules/minimist/index.js"

import { FileSystem } from "https://deno.land/x/quickr@0.6.62/main/file_system.js"

const packageInfo = JSON.parse(FileSystem.sync.read(`${FileSystem.thisFolder}/package.json`))

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
    console.log(`ible ${packageInfo.version}`)
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
const baseDirectory = path.join(FileSystem.thisFolder, "docs")
const videoDirectory = path.join(os.homedir(), "videos")

//
// setup the server
//
const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".wmv": "video/x-ms-wmv",
    ".flv": "video/x-flv",
    ".webm": "video/webm",
    ".ogg": "video/ogg",
    ".mkv": "video/x-matroska",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",
    ".m4v": "video/x-m4v",
    ".f4v": "video/mp4", // f4v is a variant of mp4
    ".mng": "video/x-mng",
    ".ts": "video/mp2t",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".mpe": "video/mpeg",
    ".mpv": "video/mpv",
    ".mxf": "application/mxf",
    ".ogv": "video/ogg",
    ".svi": "video/vnd.sealedmedia.softseal.mov",
    ".3gp2": "video/3gpp2",
    ".m2ts": "video/MP2T",
    ".mts": "video/MP2T",
    ".ttml": "application/ttml+xml",
    ".xspf": "application/xspf+xml",
    ".ass": "application/x-ass",
    ".ssa": "application/x-ssa",
    ".srt": "application/x-subrip",
}

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} received.`)
    
    let filePath = path.join(baseDirectory, req.url === "/" ? "index.html" : req.url)
    
    if (req.url.startsWith("/videos/")) {
        let videoPath = path.join(videoDirectory, req.url.replace(/^\/videos\//, ""))
        console.debug(`videoPath is:`,videoPath)
        if (fs.existsSync(videoPath)) {
            filePath = videoPath
        }
    }

    let extname = String(path.extname(filePath)).toLowerCase()
    let contentType = mimeTypes[extname] || "application/octet-stream"

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                fs.readFile(path.join(baseDirectory, "404.html"), (err, content404) => {
                    res.writeHead(404, { "Content-Type": "text/html" })
                    res.end(content404, "utf-8")
                })
            } else {
                res.writeHead(500)
                res.end(`Sorry, check with the site admin for error: ${error.code} ..\n`)
                res.end()
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType })
            res.end(content, "utf-8")
        }
    })
})

server.listen(port, hostname, () => {
    console.log(`# `)
    console.log(`# Server running at http://${hostname}:${port}/`)
    console.log(`# `)
    console.log()
    console.log(`Put your videos somewhere in here:\n${videoDirectory}`)
})

// (this comment is part of deno-guillotine, dont remove) #>