<p align="center">
    <img width="1268" alt="ible_logo" src="https://github.com/user-attachments/assets/36db4731-f465-4530-940f-d6e0d4017d9a" />
</p>

# What is this?

A tool for adding timestamp annotations for videos, especially for small teams of researchers who care about label validation of confidential video.

<img width="1422" alt="Screen Shot 2025-01-06 at 3 38 02 PM" src="https://github.com/user-attachments/assets/5d1c0d65-eb99-4150-9487-706b923a3159" />

![Screen Shot 2025-01-06 at 5 44 47 PM](https://github.com/user-attachments/assets/d9c99a73-716e-4172-be30-e543686b050b)


# How do I use it?

- If you're only labeling public youtube videos
    - Just [open this page](https://jeff-hykin.github.io/ible/) and start annotating!
    - Go to the search tab, paste a youtube video url in the search textbox, and press enter
    - Create new annotations by clicking the "Add Observation" button
    - Hover over the circle in the bottom right corner to download your annotations as a csv file
- If you're labeling private videos
    - [download the program](https://jeff-hykin.github.io/ilab-database/) 
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
