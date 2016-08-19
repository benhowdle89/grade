const prefixes = ['webkit', 'moz', 'ms', 'o']

class Grade {
    constructor(container) {
        this.container = container
        this.image = this.container.querySelector('img')
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.imageDimensions = {
            width: 0,
            height: 0
        }
        this.imageData = []
        this.readImage()
    }

    readImage() {
        this.imageDimensions.width = this.image.width
        this.imageDimensions.height = this.image.height
        this.render()
    }

    getImageData() {
        this.imageData = Array.from(this.ctx.getImageData(
            0, 0, this.imageDimensions.width, this.imageDimensions.height
        ).data)
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
        const val = this.getRGBAGradientValues(top)
        return prefixes.map(prefix => {
            return `background-image: -${prefix}-linear-gradient(
                        to bottom right,
                        ${val}
                    )`
        }).concat([`background-image: linear-gradient(
                    to bottom right,
                    ${val}
                )`]).join(';')
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
            }).sort((a, b) => a.brightness - b.brightness).reverse().slice(0, 2)
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

    renderGradient() {
        let chunked = this.getChunkedImageData()
        let gradientProperty = this.getCSSGradientProperty(this.getTopValues(this.getUniqValues(chunked)))
        let style = `${this.container.getAttribute('style') || ''} ${gradientProperty}`
        this.container.setAttribute('style', style)
    }

    render() {
        this.canvas.width = this.imageDimensions.width
        this.canvas.height = this.imageDimensions.height
        this.ctx.drawImage(this.image, 0, 0)
        this.getImageData()
        this.renderGradient()
    }
}

module.exports = (containers) => {
    NodeList.prototype.isPrototypeOf(containers)
    ? Array.from(containers).forEach(container => new Grade(container))
    : new Grade(containers)
}
