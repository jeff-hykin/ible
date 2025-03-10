#!/usr/bin/env sh
"\"",`$(echo --% ' |out-null)" >$null;function :{};function dv{<#${/*'>/dev/null )` 2>/dev/null;dv() { #>
echo "1.42.1"; : --% ' |out-null <#'; }; version="$(dv)"; deno="$HOME/.deno/$version/bin/deno"; if [ -x "$deno" ]; then  exec "$deno" run -q -A --no-lock "$0" "$@";  elif [ -f "$deno" ]; then  chmod +x "$deno" && exec "$deno" run -q -A --no-lock "$0" "$@";  fi; bin_dir="$HOME/.deno/$version/bin"; exe="$bin_dir/deno"; has () { command -v "$1" >/dev/null; } ;  if ! has unzip; then if ! has apt-get; then  has brew && brew install unzip; else  if [ "$(whoami)" = "root" ]; then  apt-get install unzip -y; elif has sudo; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  sudo apt-get install unzip -y; fi; elif has doas; then  echo "Can I install unzip for you? (its required for this command to work) ";read ANSWER;echo;  if [ "$ANSWER" = "y" ] || [ "$ANSWER" = "yes" ] || [ "$ANSWER" = "Y" ]; then  doas apt-get install unzip -y; fi; fi;  fi;  fi;  if ! has unzip; then  echo ""; echo "So I couldn't find an 'unzip' command"; echo "And I tried to auto install it, but it seems that failed"; echo "(This script needs unzip and either curl or wget)"; echo "Please install the unzip command manually then re-run this script"; exit 1;  fi;  repo="denoland/deno"; if [ "$OS" = "Windows_NT" ]; then target="x86_64-pc-windows-msvc"; else :;  case $(uname -sm) in "Darwin x86_64") target="x86_64-apple-darwin" ;; "Darwin arm64") target="aarch64-apple-darwin" ;; "Linux aarch64") repo="LukeChannings/deno-arm64" target="linux-arm64" ;; "Linux armhf") echo "deno sadly doesn't support 32-bit ARM. Please check your hardware and possibly install a 64-bit operating system." exit 1 ;; *) target="x86_64-unknown-linux-gnu" ;; esac; fi; deno_uri="https://github.com/$repo/releases/download/v$version/deno-$target.zip"; exe="$bin_dir/deno"; if [ ! -d "$bin_dir" ]; then mkdir -p "$bin_dir"; fi;  if ! curl --fail --location --progress-bar --output "$exe.zip" "$deno_uri"; then if ! wget --output-document="$exe.zip" "$deno_uri"; then echo "Howdy! I looked for the 'curl' and for 'wget' commands but I didn't see either of them. Please install one of them, otherwise I have no way to install the missing deno version needed to run this code"; exit 1; fi; fi; unzip -d "$bin_dir" -o "$exe.zip"; chmod +x "$exe"; rm "$exe.zip"; exec "$deno" run -q -A --no-lock "$0" "$@"; #>}; $DenoInstall = "${HOME}/.deno/$(dv)"; $BinDir = "$DenoInstall/bin"; $DenoExe = "$BinDir/deno.exe"; if (-not(Test-Path -Path "$DenoExe" -PathType Leaf)) { $DenoZip = "$BinDir/deno.zip"; $DenoUri = "https://github.com/denoland/deno/releases/download/v$(dv)/deno-x86_64-pc-windows-msvc.zip";  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;  if (!(Test-Path $BinDir)) { New-Item $BinDir -ItemType Directory | Out-Null; };  Function Test-CommandExists { Param ($command); $oldPreference = $ErrorActionPreference; $ErrorActionPreference = "stop"; try {if(Get-Command "$command"){RETURN $true}} Catch {Write-Host "$command does not exist"; RETURN $false}; Finally {$ErrorActionPreference=$oldPreference}; };  if (Test-CommandExists curl) { curl -Lo $DenoZip $DenoUri; } else { curl.exe -Lo $DenoZip $DenoUri; };  if (Test-CommandExists curl) { tar xf $DenoZip -C $BinDir; } else { tar -Lo $DenoZip $DenoUri; };  Remove-Item $DenoZip;  $User = [EnvironmentVariableTarget]::User; $Path = [Environment]::GetEnvironmentVariable('Path', $User); if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) { [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User); $Env:Path += ";$BinDir"; } }; & "$DenoExe" run -q -A --no-lock "$PSCommandPath" @args; Exit $LastExitCode; <# 
# */0}`;


//
// NOTE: this is a js file, despite the .ps1 extension (google "Deno Guillotine")
//

import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.67/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.6.67/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.67/main/console.js"
import { binaryify } from "https://deno.land/x/binaryify@2.4.1.0/binaryify_api.js"
import { fill } from "https://deno.land/x/html_bundle@0.0.1.2/main/impure_api.js"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix } from "https://deno.land/x/good@1.7.1.1/string.js"

// this file was made for debugging the executable, it is a terrible hack that dumps all the code into a single string and then evals it

var projectFolder = FileSystem.normalize(`${FileSystem.thisFolder}/../`)
var buildFolder = FileSystem.normalize(`${projectFolder}/docs/`)
var tempFolder = FileSystem.normalize(`${projectFolder}/temp.ignore/`)
var mainJsPath            = `${projectFolder}/main.js`
var bundledHtmlPath       = `${tempFolder}/index.bundled.html`
var binaryifiedHtmlPath   = `${tempFolder}/index.binaryified.js`
var tempMainJsPath        = `${projectFolder}/main.temp.ignore.js` // cant be in tempFolder because of relative import paths
var bundledMainJsPath     = tempMainJsPath.replace(/\.js$/, ".bundle.js")
var binarifiedMainJsPath  = bundledMainJsPath.replace(/\.js$/, ".binaryified.js")
var mainJsEvalWrapperPath = `${projectFolder}/main.temp.ignore.eval_wrapper.js`
var binariesFolder        = `${tempFolder}/executables/`

console.log(`Compilation Process:`)
console.log(`    making sure temp folder exists`)
await FileSystem.ensureIsFolder(tempFolder)

console.log(`    bundling index.html`)
await fill({
    indexHtmlPath: `${buildFolder}/index.html`,
    newPath: bundledHtmlPath,
})
console.log(`    binaryifying index.html`)
await binaryify({
    pathToBinary: bundledHtmlPath,
    pathToBinarified: binaryifiedHtmlPath,
})

const relativeBinaryifiedHtmlPath = JSON.stringify(
    "./"+FileSystem.makeRelativePath({
        from: projectFolder,
        to: binaryifiedHtmlPath,
    })
)

console.log(`    copying main.js`)
await FileSystem.copy({
    from: mainJsPath,
    to: tempMainJsPath,
    overwrite: true,
})

console.log(`    patching main.js`)
const tempMainJsContents = await FileSystem.read(tempMainJsPath)
const patchedMain = tempMainJsContents.replace(/var indexHtmlBytes \/\/ DONT REMOVE: this comment is part of compiling.+/, `import indexHtmlBytes from ${relativeBinaryifiedHtmlPath}`)
await FileSystem.write({path: tempMainJsPath, data: patchedMain})


// 
// bundling
// 
import { build } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
// import { BuildOptions } from "https://deno.land/x/esbuild@v0.18.17/mod.js"
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.8.1/mod.ts"
import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts"
console.log(`    bundling main.js`)
await new Promise(async (resolve, reject)=>{
    await build({
        bundle: true,
        entryPoints: [tempMainJsPath],
        jsxFactory: "h",
        format: "esm",
        plugins: [
            {
                "name": "resolve-on-build",
                "setup": (build) => {
                    build.onEnd((result) => {
                        resolve()
                    })
                },
            },
            ...denoPlugins()
        ],
        outfile: bundledMainJsPath,
        external: []
    }).catch(reject)
})

// 
// binaryify everything
// 
console.log(`    binaryifying ${FileSystem.makeRelativePath({from: projectFolder, to: bundledMainJsPath})}`)
await binaryify({
    pathToBinary: bundledMainJsPath,
    pathToBinarified: binarifiedMainJsPath,
})

// 
// create executable wrapper
//
console.log(`    creating wrapper for ${FileSystem.makeRelativePath({from: projectFolder, to: mainJsEvalWrapperPath})}`)
FileSystem.sync.write({
    path: mainJsEvalWrapperPath,
    data: `
        import mainBytes from ${JSON.stringify(binarifiedMainJsPath)}
        const mainAsString = new TextDecoder().decode(mainBytes)
        const noHashBangString = mainAsString.replace(/^#!.+/, "")
        console.log("starting eval")
        await eval(\`((async ()=>{
            \${noHashBangString}
        })())\`)
    `,
})

//
// compile to binaries
//
console.log(`    compiling ${FileSystem.makeRelativePath({from: projectFolder, to: mainJsEvalWrapperPath})}`)
const targets = [
    "x86_64-unknown-linux-gnu",
    "aarch64-unknown-linux-gnu",
    "x86_64-pc-windows-msvc",
    "x86_64-apple-darwin",
    "aarch64-apple-darwin",
]
await FileSystem.ensureIsFolder(binariesFolder)
for (const eachTarget of targets) {
    const targetPath = `${binariesFolder}/${eachTarget}`
    FileSystem.sync.remove(targetPath)
    console.log(`    compiling to ${FileSystem.makeRelativePath({from: projectFolder, to: targetPath})}`)
    const output = await run`deno compile --no-npm -A --target ${eachTarget} --output ${targetPath} ${mainJsEvalWrapperPath} ${Out(returnAsString)}`
    console.log(indent({ string: output, by: "        " }))
}
console.log(`    done!`)
// FileSystem.remove(tempMainJsPath) 

console.log(`Executables are in: ${FileSystem.makeRelativePath({from: projectFolder, to: binariesFolder})}`)

Deno.exit(0) // because esbuild creates dangling promises that keep the process running
// (this comment is part of deno-guillotine, dont remove) #>