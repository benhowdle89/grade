# Grade

[![](https://img.shields.io/npm/dt/grade-js.svg)](https://www.npmjs.com/package/grade-js)

## Demo

[Check it out](https://benhowdle89.github.io/grade/)

## Install

Download this repo and grab the `grade.js` file from the `/docs/dist` folder.

Or install from npm: `npm install grade-js`

Use the CDN link:

`https://unpkg.com/grade-js/docs/dist/grade.js`

## Usage

Recommended HTML structure:

```html
<!--the gradients will be applied to these outer divs, as background-images-->
<div class="gradient-wrap">
    <img src="./samples/finding-dory.jpg" alt="" />
</div>
<div class="gradient-wrap">
    <img src="./samples/good-dinosaur.jpg" alt="" />
</div>
```

If you have the `grade.js` in your project, you can include it with a script tag and initialise it like so:

```html
<script src="path/to/grade.js"></script>
<script type="text/javascript">
    window.addEventListener('load', function(){
        /*
            A NodeList of all your image containers (Or a single Node).
            The library will locate an <img /> within each
            container to create the gradient from.
         */
        Grade(document.querySelectorAll('.gradient-wrap'))
    })
</script>
```

If you pass in a 3rd parameter and it's a function, the HTML element(s) you passed in as the 1st parameter will **not** be manipulated, but an array will be returned to you, for you to do as you please with, ie.
```javascript
Grade(document.querySelectorAll('.gradient-wrap'), null, function(gradientData){
    // sample contents of `gradientData` can be inspected here https://jsonblob.com/57c4601ee4b0dc55a4f180f1
})
```

If you've installed from npm, you can use the library like so:

```javascript
import Grade from 'grade-js'
// initialise as above
```

The module this imports will be using ES2015 syntax, so it will need to be transpiled by a build tool, like [Babel](https://babeljs.io/), and if you are importing the module in this fashion (and using npm), I imagine you're already using a bundling tool, like Webpack or Browserify!

## Running locally

If you want to run this locally, just to test it, you need to serve `index.html` via a webserver, not just by opening it in a browser, else the browser will throw a security error. I would recommend either [live-server](https://www.npmjs.com/package/live-server) (requires Node.js installed on your machine) or if you have Python installed, just run `python -m SimpleHTTPServer` inside the project root. If you're on Windows, I believe WAMP/Apache is the best way to go.

## Remote images

This plugin utilises the `<canvas>` element and the `ImageData` object, and due to cross-site security limitations, the script will fail if one tries to extract the colors from an image not hosted on the current domain, *unless* the image allows for [Cross Origin Resource Sharing](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

__Enabling CORS on S3__

To enable CORS for images hosted on S3 buckets, follow the Amazon guide [here](http://docs.aws.amazon.com/AmazonS3/latest/UG/EditingBucketPermissions.html); adding the following to the bucket's CORS configuration:

```xml
<CORSRule>
 <AllowedOrigin>*</AllowedOrigin>
 <AllowedMethod>GET</AllowedMethod>
</CORSRule>
```

For all images, you can optionally also include a cross-origin attribute in your image.

```html
<img src="/image.jpg" cross-origin="anonymous"/>
```

## License

MIT License

Copyright (c) 2016 Ben Howdle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
