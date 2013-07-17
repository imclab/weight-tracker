# Weight Tracker - A 60fps Mobile Web App

## http://weight.aerotwist.com

![image](http://aerotwist.com/blog/making-a-60fps-mobile-app/images/screens.jpg)

This is a web app that I built to see if it was _actually_ possible to create an application that runs at 60fps on modern smartphones. For the most part it was successful. If you're interested, [there's a blog post](http://aerotwist.com/blog/making-a-60fps-mobile-app/) you can read.

**Note: the source code is not heavily commented as yet. As I have time I will try to put some time into doing that. Hopefully it will be readable as-is, but I apologise if you run into readability issues!**

If you're interested in dissecting the app start with `/src/misc/bootstrap.js` and `/src/app.js`. The `<canvas>` based components are found in `/src/view/ticker.js` and `/src/view/dial.js`.

The dial component, since it is used for both weight and height entry has a wrapper component that configures it found at `/src/view/dialentry.js`, and the `weightentry.js` and `heightentry.js` then use that. Overly engineered, I know, it's all a learning process!

This application is © Google 2013. Please see the LICENSE file for more details.
