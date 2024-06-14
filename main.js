const http = require("http")
const fs = require("fs")
const path = require("path")
const os = require("os")
const packageInfo = require("./package.json")

const minimist = require("minimist")

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
const baseDirectory = path.join(__dirname, "docs")
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
    console.log(`Server running at http://${hostname}:${port}/`)
    console.log(`Put your videos somewhere in here:\n${videoDirectory}`)
})
