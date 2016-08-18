class Grade {
    constructor(input, root) {
        this.input = input
        this.root = root
        this.image = new Image()
        this.canvas = document.createElement('canvas')
        this.canvas.classList.add('originalImage')
        this.ctx = this.canvas.getContext('2d')
        this.imageDimensions = {
            width: 0,
            height: 0
        }
        this.imageData = []
        this.bind()
    }

    bind() {
        this.input.addEventListener('change', event => {
            this.root.innerHTML = ''
            this.processOnInputChange(event.target)
        })
    }

    processOnInputChange({
        files
    }) {
        let file = files && files[0]
        this.readImage(file)
    }

    readImage(file) {
        this.image.onload = () => {
            this.imageDimensions.width = this.image.width
            this.imageDimensions.height = this.image.height
            this.render()
        }
        this.image.src = URL.createObjectURL(file)
    }

    getImageData() {
        this.imageData = this.ctx.getImageData(
            0, 0, this.imageDimensions.width, this.imageDimensions.height
        ).data
        this.renderRGBAs()
    }

    getChunkedImageData() {
        const perChunk = 4

        return this.imageData.reduce((ar, it, i) => {
            const ix = Math.floor(i / perChunk)
            if (!ar[ix]) {
                ar[ix] = []
            }
            ar[ix].push(it)
            return ar
        }, [])
    }

    getRGBAGradientValues(top) {
        return top.map((color, index) => {
            return `rgb(${color.rgba.slice(0, 3).join(',')})`
        }).join(',')
    }

    getCSSGradientProperty(top) {
        return `linear-gradient(
                    to bottom right,
                    ${this.getRGBAGradientValues(top)}
                )`
    }

    getTopValues(uniq) {
        return [
            ...Object.keys(uniq).map(key => {
                const rgbaKey = key
                let components = key.split('|'),
                    brightness = ((components[0] * 299) + (components[1] * 587) + (components[2] * 114)) / 1000
                return {
                    rgba: rgbaKey.split('|'),
                    occurs: uniq[key]
                }
            }).sort((a, b) => a.brightness - b.brightness).reverse().slice(0, 3)
        ]
    }

    getUniqValues(chunked) {
        return chunked.reduce((accum, current) => {
            let key = current.join('|')
            if (!accum[key]) {
                accum[key] = 1
                return accum
            }
            accum[key] = ++(accum[key])
            return accum
        }, {})
    }

    renderRGBAs() {
        let chunked = this.getChunkedImageData()
        let gradientProperty = this.getCSSGradientProperty(this.getTopValues(this.getUniqValues(chunked)))
        let gradient = document.createElement('div')
        gradient.classList.add('gradient')
        gradient.style.backgroundImage = gradientProperty
        gradient.style.width = `${this.imageDimensions.width}px`
        gradient.style.height = `${this.imageDimensions.height}px`
        this.root.appendChild(gradient)
    }

    render() {
        this.canvas.width = this.imageDimensions.width
        this.canvas.height = this.imageDimensions.height
        this.ctx.drawImage(this.image, 0, 0)
        this.root.appendChild(this.canvas)
        this.getImageData()
    }

}
