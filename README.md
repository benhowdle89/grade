# Grade

## Install

Download this repo and grab the `grade.js` file from the `/dist` folder.

Or install from npm: `npm install grade`

## Usage

If you have the `grade.js` in your project, you can include it with a script tag and initialise it like so:

```javascript
<script src="path/to/grade.js"></script>
<script type="text/javascript">
    window.addEventListener('load', function(){
        /*
            A NodeList of all your image containers.
            The library will locate an <img /> within each
            container to create the gradient from.
         */
        Grade(document.querySelectorAll('.gradient-wrap'))
    })
</script>
```

If you've installed from npm, you can use the library like so:

```javascript
import Grade from 'grade'
// initialise as above
```
