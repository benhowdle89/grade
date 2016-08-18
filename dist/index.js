'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grade = function () {
    function Grade(input, root) {
        _classCallCheck(this, Grade);

        this.input = input;
        this.root = root;
        this.image = new Image();
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('originalImage');
        this.ctx = this.canvas.getContext('2d');
        this.imageDimensions = {
            width: 0,
            height: 0
        };
        this.imageData = [];
        this.bind();
    }

    _createClass(Grade, [{
        key: 'bind',
        value: function bind() {
            var _this = this;

            this.input.addEventListener('change', function (event) {
                _this.root.innerHTML = '';
                _this.processOnInputChange(event.target);
            });
        }
    }, {
        key: 'processOnInputChange',
        value: function processOnInputChange(_ref) {
            var files = _ref.files;

            var file = files && files[0];
            this.readImage(file);
        }
    }, {
        key: 'readImage',
        value: function readImage(file) {
            var _this2 = this;

            this.image.onload = function () {
                _this2.imageDimensions.width = _this2.image.width;
                _this2.imageDimensions.height = _this2.image.height;
                _this2.render();
            };
            this.image.src = URL.createObjectURL(file);
        }
    }, {
        key: 'getImageData',
        value: function getImageData() {
            this.imageData = this.ctx.getImageData(0, 0, this.imageDimensions.width, this.imageDimensions.height).data;
            this.renderRGBAs();
        }
    }, {
        key: 'getChunkedImageData',
        value: function getChunkedImageData() {
            var perChunk = 4;

            return this.imageData.reduce(function (ar, it, i) {
                var ix = Math.floor(i / perChunk);
                if (!ar[ix]) {
                    ar[ix] = [];
                }
                ar[ix].push(it);
                return ar;
            }, []);
        }
    }, {
        key: 'getRGBAGradientValues',
        value: function getRGBAGradientValues(top) {
            return top.map(function (color, index) {
                return 'rgb(' + color.rgba.slice(0, 3).join(',') + ')';
            }).join(',');
        }
    }, {
        key: 'getCSSGradientProperty',
        value: function getCSSGradientProperty(top) {
            return 'linear-gradient(\n                    to bottom right,\n                    ' + this.getRGBAGradientValues(top) + '\n                )';
        }
    }, {
        key: 'getTopValues',
        value: function getTopValues(uniq) {
            return [].concat(_toConsumableArray(Object.keys(uniq).map(function (key) {
                var rgbaKey = key;
                var components = key.split('|'),
                    brightness = (components[0] * 299 + components[1] * 587 + components[2] * 114) / 1000;
                return {
                    rgba: rgbaKey.split('|'),
                    occurs: uniq[key]
                };
            }).sort(function (a, b) {
                return a.brightness - b.brightness;
            }).reverse().slice(0, 3)));
        }
    }, {
        key: 'getUniqValues',
        value: function getUniqValues(chunked) {
            return chunked.reduce(function (accum, current) {
                var key = current.join('|');
                if (!accum[key]) {
                    accum[key] = 1;
                    return accum;
                }
                accum[key] = ++accum[key];
                return accum;
            }, {});
        }
    }, {
        key: 'renderRGBAs',
        value: function renderRGBAs() {
            var chunked = this.getChunkedImageData();
            var gradientProperty = this.getCSSGradientProperty(this.getTopValues(this.getUniqValues(chunked)));
            var gradient = document.createElement('div');
            gradient.classList.add('gradient');
            gradient.style.backgroundImage = gradientProperty;
            gradient.style.width = this.imageDimensions.width + 'px';
            gradient.style.height = this.imageDimensions.height + 'px';
            this.root.appendChild(gradient);
        }
    }, {
        key: 'render',
        value: function render() {
            this.canvas.width = this.imageDimensions.width;
            this.canvas.height = this.imageDimensions.height;
            this.ctx.drawImage(this.image, 0, 0);
            this.root.appendChild(this.canvas);
            this.getImageData();
        }
    }]);

    return Grade;
}();