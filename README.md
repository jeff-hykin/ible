# What is this?

A tool for labeling segments of videos!

# How do I use it?

- Prerequisite: know how to use a terminal
- Install nodejs/npm
- Download the code [zip file here](https://github.com/jeff-hykin/iilvd-online/archive/refs/heads/master.zip) (or better: `git clone https://github.com/jeff-hykin/iilvd-online`)
- In a terminal, `cd` into the folder you downloaded
- Run `npx http-server ./docs`
- Put your videos in the `docs/videos/` folder
- Open the url in your browser ([http://127.0.0.1:8080](http://127.0.0.1:8080))
- Go to the search tab, and in the textbox type `/videos/name_of_your_video.mp4` and press enter
- Create new annotations by clicking the "Add Observation" button!
- See the [guide](https://github.com/jeff-hykin/iilvd-online/blob/master/iLab%20Database.pdf) for more info

Note: uploading data in the 10-thousands range will cause the site to get slow.

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

To annotate local videos (beta), put them under the `dist/videos/` folder and then, in the search textbox, type `/videos/name_of_your_video.mp4` and press enter. It should pull up your video and allow for annotations. When annotations are downloaded the video id will be `/videos/name_of_your_video.mp4` (in comparison to the Youtube video id).

To deploy (slightly better performance) do:

```sh
npm run build
npm run serve
```