### Prerequisites

This document assumes you have downloaded/git-cloned this project, and are generally familiar with the command line.

### Overview
- The codebase is a bit messy because there was a 4 year gap, and a change in direction

### How do I run this project and make a new release?
- If you want to hack something really small in:
    - you can open up the `docs/Root.SOMETHING.js` file and edit it directly.
    - Run `./main.js` to start the server and debug it in your browser
    - Then see the release process below
- If you want to do more proper development:
    - If you're not going to hack the `docs/Root.SOMETHING.js` file, then we need to have the full build environment
    - The build environment would be a pain (NodeJS v14.17.1, and Vue 2.6.12), EXCEPT that this project is build on top of Nix. Nix makes things extremely reproducable, like version numbers aren't even good enough, it installs dependencies that are identical, all the way down to the cryptographic hash of the source code. It was painful, but I've automated the setup with Nix. Executing `commands/start` will install Nix (if needed) and install the correct versions of all dependencies without affecting your system. No `npm install` or other steps necessary, it will put you in a special shell with access to the full build environment and project commands.
    - Once inside the build environment, you can run `run/build_and_serve` to start the server and debug it in your browser. Note: the build environment uses a fake home folder to make sure that the project doesn't touch your real home folder.
    - Once you've got the build environment, you can edit the `.vue` files and it will auto-update the docs folder.
    - After you're done editing, follow the release process below

### The release process
Once you're ready to make a release, execute `run/compile` and it will generate a `temp.ignore/executables` folder that contains all the executables for all the different platforms. Those files are what go into a release.
- NOTE: you might consider the release process kinda cursed.
    - To make a self-contained executable, we need all the dependencies to be a javascript import.
    - Well... one of the dependencies on the index.html. So we need to convert the index.html to javascript file.
        - And there is a second problem. The index.html links to javascript and css files.
        - Well I wrote a tool that bundles JS and CSS into one html file ([html-bundle](https://github.com/jeff-hykin/html-bundle)).
        - That bundle step is part of the compile step, so it happens automatically.
        - But again, we need the html to be a javascript import if we want it to end up in the executable.
        - Well, believe it or not, even before this project, I had a tool that did this reliably for any kind of file not just text files ([binrayify](https://github.com/jeff-hykin/binaryify)).
        - So, after the html/js/css is bundled into one HTML file, the compile script then binaryifies it to make it a javascript import
    - The only truly hacky aspect of the compilation is the `var indexHtmlBytes // DONT REMOVE: this comment is part of compiling this file sadly`.
        - As you might have guessed, that is where we add the javascript import of the html file.
    - The server (main.js) is what gets compiled, and it mostly just serves the html file.

### What does this project uses
- frontend:
    - Vue 2
        - [KeenUI component library](https://josephuspaye.github.io/Keen-UI/#/ui-alert)
        - pug instead of html
        - sass (not scss but sass) instead of css
    - window.storageObject as a wrapper around localStorage (e.g. persistent storage)
- backend/server is small
    - uses Deno, but you can import/use NodeJS stuff
    - mostly a static file server (videos, html/js/css)
    - extra APIs for
        - listing paths to all video files
        - renaming a video file to have an id
    - Note: the "listing paths to all video files" has some complications
        - We don't compute the paths on-demand, but rather in a loop.
        - This means there won't be a computation spike if 50 clients ask for the list of video paths
        - The client asks for the list video paths continuously (I could setup web sockets to push "new video path" events but whatever)
        - There's a way to keep the list updated efficiently using Deno's built-in file watcher. I'm not doing that. I'd be good to do that in the future. Right now I'm effectively just looping and scanning the file system every X seconds. NOTE: its at least in a way that file-scans won't pile-up (e.g. doesn't use setInterval). It waits for the scan to finish before waiting for a set duration.

### Where's the (important) Frontend Data
- Other than the raw video files, all data is client side right now, either saved to Indexed DB (frontend database) or stored in `$root` from `Root.vue`
    - Sadly some data is treats as "being"/existing in both the database and `$root` as a source of truth. 
        - E.g. there is NOT a strict data flow of "UI edit => update the database, database response => updates $root"
        - Its more like, UI changes $root, we detect changes in `$root`, update the database. Or: ask backend for info, update database, then update `$root`. Etc
        - It'd be great to clean this up, but $root data is reactive and watched and edited by all different parts of the UI
    - When downloading stuff
        - it comes from
               - either `$root.searchResults`
               - or (if no search filters) it pulls all observations/videos from frontendDb 
        - Data format is heavily converted. In other words database tables ≠ downloaded tables
            - The database is, conceptually, a big JSON object, with "videos" and "observations" as top level keys
            - The download format, in contrast, is more SQL style; multiple tables, tables-of-relationships instead of nested values
            - NOTE: a hack on CSV datatypes
                 - Humans (non-developers) need CSV (I assume)
                 - PROBLEM: by default CSV is garbage for data types. We can't tell the difference between null and empty-string or "1" and 1. This is an issue for this codebase and upload actions.
                 - MY SOLUTION: I (with caveats) yaml-stringify each cell value on-write, and yaml-parse each cell value on-read
                     - After yaml.stringify-ing, the whole thing is CSV escaped (so quotes can end up double escaped)
                     - the values get converted as follows:
                         - null/undefined becomes the empty string (allowed by yaml.stringify but not always the default behavior)
                         - The empty string, when stringified, becomes to a string with two double quotes (just like JSON.stringify). Meaning, in Excel, the cell isn't empty, it's a cell with two quotes in it. Not the greatest UX, but it lets us tell the difference between null (empty cell) and an empty string (cell with two quotes).
                         - Its a similar kinda-crappy UX for some strings like "1" or " " (a space) or "true". e.g. yaml.stringify("1") == "\"1\"", and in Excel the user is going to see "1" (with the quotes being visible in the box)
                         - However, here is where the magic happens: in yaml most strings don't need quotes. yaml.stringify("hello") == "hello" != "\"hello\"". So, in Excel, the cell will simply contain hello.
                         - This is the best 
                         - NOTE: there are some extra more-strict caveats. Strings such as an ISO date string don't get quotes when given to yaml.stringify. I give them (and other patterns) quotes I have a whole reserved space of things that technically-don't-need quotes getting quotes so that in the future we can parse them as a literal value (ex: 2020-20-20 is parsed as date rather than as a string)
    - If you wanted to adapt this codebase to use a real/backend database:
        - you would simply edit `database.js` and make an alternative to `frontendDb` that has the same API, then swap all calls to `frontendDb` for your new alternative
        - every interaction to the database is through that API
        - Note: the labels and users are not really a database table (yet) previously everything, even the video data, was just generated by looking at the observations table.

    - The $root data (from `root.vue`) is a mess partly because the design changed
        - `routeData$`
            - This is a reactive value that can be watched, but only Root does/should watch it.
            - Everything in this object corrisponds to what is in the URL. Changing the object changes the URL. Changing parts of the object, like videoId, will effectively trigger a page load, and add to the history (e.g. the back button in the browser will undo the change to routeData$)
        - `searchResults` & `filterAndSort`
            - search results (and filters) are too integrated
            - For example at the moment
                - And clicking to "See clips" for a specific label is implemented by adding the label name as a filter in the search
                - But the label filter also comes from the routeData$ (clicking "See Clips" adds it to the route data)
                - The video list on the right shows search-results videos
                - And the download button downloads observations returned by search results
        - `selectedSegment`
            - should (and used to) change the routeData$. But not high priority. This value is set by both the ObservationEditor and SegmentDisplay
        - email
            - used by ObservationEditor.vue, set by Root.vue, updated by Search.vue
        - labels
             - this data is not on parity with the labels database data because it (additionally) contains "selected" which is a frontend-only attribute
             - TODO: labels should have a proper database table (not always-generated data) and stuff like addLabel should be removed in favor of a labels-manager that listens for globalEvents.observationUpdated, globalEvents.observationRemoved, with a sanity/backup option of scanning all observations to re-compute stuff like number of videos with the  at least one observation with the label

### How do I do video-stuff (Frontend)
- Video functionality probably the most messy because so much depends on the video player
- `video_storage_manager.js` is the new but incomplete refactor of video-based events. Ideally anything that needs video-stuff from the database should have to talk to video_storage_manager.js. Like I said though, its incomplete.
- `video_tools.js` constains a bunch of pure functions, and is the source-of-truth when it comes to video formats/validation. Eventually it'd be nice for video_storage_manager.js to be the only frontend file importing video_tools.js
- `$root.videoInterface` is the current runtime-manager of video stuff. It trys to make sure stuff like isVideoLoaded, isVideoPlaying, etc behave correctly, update when the route changes, etc. It should be squashed and replaced by video_storage_manager.js
- `VideoPlayer.vue` is the only thing that can detect the duration of a video
    - lots of things (like SegmentDisplay) depend on the duration of the video, so they have to wait/check for when the duration is discovered
- the backend is the only one that knows the paths of the videos
        - Root.vue asks the backend in a loop for the list of video paths, then tells video_storage_manager.js

### How do I do observation-stuff (Frontend)
- `ObservationEditor.vue` and `SegmentDisplay.vue` are the main two files
- Similar to video-stuff, the observation-stuff has a `observation_tooling.js` as a source-of-truth and `observation_storage_manager.js`
- Unlike video stuff, observation stuff isn't quite as messy. The main thing is it does have to wait on a video duration to be known.
- Their are quite a few moving parts because of ObservationEditor and SegmentDisplay need to talk to each other even though they are in different parts of the heirarchy.