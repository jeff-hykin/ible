# What is this?

A tool for labeling segments of videos!

# How do I use it?

- If you're only labeling public youtube videos, simply go [here](https://jeff-hykin.github.io/iilvd-online/) and start annotating!
    - Go to the search tab, paste a youtube video url in the search textbox, and press enter
    - Create new annotations by clicking the "Add Observation" button
    - Hover over the circle in the bottom right corner to download your annotations as a csv file
- If you're labeling private videos, [download the program](https://jeff-hykin.github.io/ilab-database/) and double click the executable
    - Put your videos in your home folder inside a videos folder (e.g. `$HOME/videos/`)
    - Go to the search tab, and start typing `name_of_your_video.mp4` and press enter
    - Create new annotations by clicking the "Add Observation" button!
    - Hover over the circle in the bottom right corner to download your annotations as a csv file
    - See the [guide](https://github.com/jeff-hykin/iilvd-online/blob/master/iLab%20Database.pdf) for more info

# Setup for Developers

Automated setup is detailed in the `documentation/setup.md`!

If you want to manually set it up, it works with node v14.17.1 and npm v6.14.13

### To debug run:

```sh
npm run build
npm run start
```

And then open then url in the browser ([http://localhost:1234](http://localhost:1234))

If you get a syntax in the browser error about "<", re-run the build command.
If you get an "Unknown error" error, check the single quotes in html attributes. Ex: this is invalid: `<div class="ui"thing"-button">`

To annotate local videos (beta), put them under the `dist/videos/` folder and then, in the search textbox, type `/videos/name_of_your_video.mp4` and press enter. It should pull up your video and allow for annotations. When annotations are downloaded the video id will be `/videos/name_of_your_video.mp4` (in comparison to the Youtube video id).

To deploy (slightly better performance) do:

```sh
npm run build
npm run serve
```