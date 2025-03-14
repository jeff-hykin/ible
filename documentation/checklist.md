Big Release Tasks:
- Record a video:
    - download the executable
    - run it
    - put two videos in the videos folder
    - load them in the browser
    - load a youtube video
    - add a timestamp with a comment
    - toggle the watched state
    - change the observer
    - switch videos
    - download the timestamps
    - show what they look like
    - explain the headers ()'s
    - delete the timestamps
    - reupload the timestamps


Publication options:
- HRI: top conference for human robotics interations
    - RO-MAN 
    - ASK Dr. Murphy, Cite xariv, joint publication
- HCI:
- Human factors field
    - HFES

- Hi! Paris (conference)
    - HRI
    - Dr. Murphy talked there
- AI SDM:
    - public help thrust
    - hosted CMU


// changes to Ible
export to excel instead of typed csv (and/or typed excel)
arguments for: its just too nice to upload/download one file, they're going to open it in excel anyways to do plots and make modifications, and its extra time/overhead to need to export each sheet back to csv

change icon of upload to download; it will be the more common task
video href link in spreadsheet
make renaming the video opt-out "let me rename it" instead of opt-in
be able to search for videos with a specific status
be able to search for videos based on folder, or even set a subfolder
pop up for marking video as watched if duration is >85%, with clicking being to cancel
delete a video and all associated timestamp data
upload needs a way to delete a specific column
add a youtube video despite no timestamp data for it
better errors when uploading; prevent merging of data if data is bad

Small Enhancements:
- add URL link for video to open up
- if there is no "Videos" folder check for "videos" and movies, notify on frontend
- stream videos from the backend

Major Chonological Changes:
- DONE: publish as npm package
- DONE: get video ID's thing working
    - finish switchging to `videoInfo` instead of `videoId`
    - figure out why segments are not showing up
    - List videos in the sidebar
    - create error response for missing the videoId but having a valid videoPath

- DONE: enable end time == start time
    - check rendering of it

- DONE: if no username is set, ask for an email (modal popup)
    - change obsever to observer-email
    - make observer non-editable in obsever view

- DONE: get listing of videos from backend to work
    - had to fix "gets"

- DONE: get zip.js working
- DONE: get csv conversion working

- DONE: add duration to the video whenever its loaded (set on frontendDb)
- DONE: Figure out why the frontendDb just doesn't work (delete doesnt delete despite saying success)
- DONE: render the videoInfo below the video
- DONE: add the observation comment field

- DONE: change "confirmed by one human"
    - make "Confirm" "Reject" buttons in non-editing mode
    - make a list of who has confirm/rejected
    - update all the validation stuff for it

- DONE: video centric data format
    - remove the generated-video manager in iilvd.js
    - add video entries to frontend DB
    - on download
        - * find all the relevent videos from the search
        - combine the observation ID's with them
        - create a TSV
    - on upload
        - check the headers
        - check that the video data is the same
        - 
    - display video speficic data
    - remove/update the format demonstration

- DONE: change upload help button
- DONE: fix the download of `observers#videos`
- DONE: check all FIXME's
- DONE: figure out why video switches get flipped on reload
- DONE: figure out why video.usersFinishedWatchingAt is not preserved on reload (or why not loaded in first place)
- DONE: check all the TODO's etc
- DONE: CSV quoting and such
    - DONE: stop converting some lists to comma-separated strings since those strings are now quoted
    - DONE: instead make the csv tooling be smart enough to write list values out as unquoted comma-separated, and make the csv reader detect it and convert to a list
    - DONE: change the =thing to (thing) for computed values
    - DONE:change the CSV export of confirmed/rejected to be comma-separated
- DONE: spacebar doesn't always play/pause
- DONE: check the executable, get something working on windows (eval method or video method)
- FUTURE: check if filtering by disagreement still works
- FUTURE: check that filtering by selected label still works
- DONE: name the video#observer to be "annotation_status.csv" "who_has_done_what.csv"
- DONE: change the `video#observer` format, make it videoId, observerId, and the all the fields for that combo
- FUTURE: probably want to download a label table:
    - total number of observations
    - total duration of all observations
    - number of videos
- NO: videos can mention what labels they have
- FUTURE: add a readme to the downloaded zip explaining the different fields and available uploadActions
- FUTURE: check the order when downloading:
    - sort by start time
    - then sort by video id
- FUTURE: ensure video ID's match a regex and dont include invalid-on-windows-filesystem characters
- check overwrite-upload, and delete-upload
    - make setter for db
- DONE: finish writing dev_notes.md
- FUTURE: put a URL in each row of the CSV export, so theres a one-click link to see the clip
- add documentation to download
    - upload actions explained
    - paraentheses explained
    - delete deletes whole thing
- upload checks:
    - fix upload action of overwrite
- clean up code
    - DONE: move stuff into tools
    - consolidate things into event files

- check all the TODO's again

LATER:
- add settings modal
    - allow the username to be set from the URL
        - remove it from the URL as soon as it gets set

Say in paper:
- "in an effort to reduce label noise" (citations) we
    - restrict labels to lowercase letters numbers and dashes
- CVAT uses frames instead of seconds, which isn't always helpful

Fixes:
- fix allowing for periods
- fix the help section
- DONE: remove `video/mp4`

Small changes:
- _
    - publish as npm package
    - change the `/videos/` behavior, only have youtube videos work if given the full URL not just the youtube id
        - if a full path is given, try requesting parts of the path until it works (maybe do this on backend)
    - create backend endpoint for autocompleting videos names/paths
    - sidebar, filter videos by name (search box)
    - flatten the observation data structure
    - make createdAt an ID field, or make it not be a string (ensure its not rounded in excel)
    - have a "note" field
    - keyboard shortcut of "enter" to create a new observation, "enter" again to set the end time and select the label name
    - keyboard shortcut of JK for next/previous observation if an observation is selected
        - dont select an observation when a video loads
        - dont select an observation after saving a new obersvation
    - keyboard shortcut of C/R for confrirm/reject
        - bypass the edit requirement
    - after +20 labels created, give a message about pressing enter to create a new label
        - press enter
        - (if they do that) "press enter (again) to set the end time"
    - Say who an observation was confirmed by
        - change to "I can confirm" checkbox (if observer != curernt user)
        - change to "I can reject" checkbox (if observer != curernt user)
        - add username to confirmation/rejection list
        - show list as comma-separated names, show number of people next to list

Medium changes:
- _
    - video ID conflict
        - on start
            - check what "no don't fix names" folders have been checked in local storage
            - tell backend what to not check
            - on backend, if anything top level folders are not in the "no don't fix" names, scan those folders
                - if anything looks like a video file, but doesn't have an id in the name, set the "someMissingId" flag
                - send result to frontend
            - on the frontend
                - if backend says any are flagged
                    - create modal
                        - have a checklist of the folders that are missing ids in the name
                        - say they need ids and ask if they'd like them to be generated
                        - if they say yes, tell the backend
            - on the backend
                - receive the list of folders to autogenerate ids for
                - rename them
        - when a video is loaded (search bar)
            - if it doesn't have an id in the name, give a modal asking to rename it
            - if yes, have the backend rename it and return the new name
            - frontend should then reload the video with the new URL
    - username/observer changes
        - if no username is set, ask for an email (modal popup)
        - make observer non-editable in obsever view
        - allow the username to be set from the URL
            - remove it from the URL as soon as it gets set
        - change username input somewhere other than on the observation, hide it from the editor view
    - have markers (no end time)
        - have a "add end time" button in place of the endTime field
        - make the end time null
        - reuse the startTime field
    - have "how do I" in the left corner
        - link to documentation PDF
        - keyboard shortcuts cheatsheet
    - better communication on the "jump to this time from video" button
        - ???? maybe pre-text the label box
        - maybe constantly update the end time with the video time if editing
            - maybe have an "edit manually" button
    - keyboard shortcut for opening the search/video/label (option+arrow keys)
        - arrow keys + visible focus when on labels or videos list
    
Big Changes:
- _
    - video-centric data format
        - marking a video as done
            - pop-up once hit the end of video playback
            - "Done + Show next" in the side-bar
            - Note: might need to have mulitple forms of done (verification VS inital labelling)
        - sidebar:
            - toggle only showing done videos
            - display which are done and which are not
        - in the side-bar, show which videos are done
        - be able to download data for one video
        - be able to edit data for one video
    - CSV
        - do we want to target medical people? yes
        - what if there was just a converter
        - Flatten out the data structure
        - rounding issue for createdAt

Future:
- would be much more efficient to do file-watching on the videos path instead of recursively listing all of them
    - if there are too many videos this could actually cause a computation problem of too many requests for listing (memory leak and slow cpu)
- how to do markers
    - `m` for instant marker
- how to update the end-time of the segment
    - if untouched, have it update with the video time
    - enter to create
    - enter again to save
- how to handle video "done" for both labeling and verification
- how to do CSV format (including escaping)
- _
    - give a notification for creating a new label (maybe on unfocus)
    - It beign an app
        - public health people
        - cognitive science
        - psychologists
    - keyboard shortcut tutorial
        - Keyboard mode: give hints on what to do at every view
    - stats: LATER 
        - label frequecny per-video (historgram)
        - box plot of label duration
    - keyboard shortcuts: LATER
        - probably go to manual
        - would press enter to set time
        - letter O for observation, or +
        - dont restict the behavior but maybe have the popup
        - have cursor auto click to the label input box after setting the end time
        - add AD for jumping between shortcuts
        - add confirm/reject shortcuts
    - usually there is a que for a person when crowd-sourcing: ?
        - create link for "email" field (comma separated emails)
        - submit/download when done
        - maybe have list of videos in the URL
    - should there be a merging tool: No (same as rename)
    - Real time intensity measuing tool

Chose to not do:
- flagging: No
- mass rename: Nope
    - maybe put a note
