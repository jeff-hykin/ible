# What is this?

The frontend of the iLab Database: a tool for annotating videos from multiple sources (humans and machine learning models).

Note: uploading data in the 10-thousands will cause the site to get slow. The site has not yet been optimized to handle that level of data.

# Setup

Everything is detailed in the `documentation/setup.md`!

# Usage

To debug run:

```sh
npm run start
```

And then open then url in the browser ([http://localhost:1234](http://localhost:1234))


To deploy (slightly better performance) do:

```sh
npm run build
npm run serve
```