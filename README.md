# What is this?

The frontend of the iLab Database: a tool for annotating videos from multiple sources (humans and machine learning models).

Note: uploading data in the 10-thousands will cause the site to get slow. The site has not yet been optimized to handle that level of data.

# Setup

Automated setup is detailed in the `documentation/setup.md`!

If you want to manually set it up, it works with node v14.17.1 and npm v6.14.13

# Usage

To debug run:

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