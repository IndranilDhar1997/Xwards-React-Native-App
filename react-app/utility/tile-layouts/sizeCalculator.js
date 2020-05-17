const sizeCalculator = {
    standardWidth: 1280,
    standardHeight: 752,
    deviceWidth: 1280,
    deviceHeight: 752,
    wFactor: 1,
    hFactor: 1,
    standardDevice: false,
    init (w,h) {
        console.log(w,h);
        if (w === this.standardWidth && h === this.standardHeight) {
            this.standardDevice = true;
        }
        this.deviceHeight = h;
        this.deviceWidth = w;
        this.wFactor = ((this.standardWidth * this.deviceHeight) / (this.standardHeight * this.deviceWidth));
        this.hFactor = (1/this.wFactor);
    },
    isStandardDevice() {
        return this.standardDevice;
    },
    width (w) {
        if (this.standardDevice) {
            return w;
        }
        w = ((this.deviceWidth*w*this.wFactor)/this.standardWidth)
        return w;
    },
    height (h) {
        if (this.standardDevice) {
            return h;
        }
        h = ((this.deviceHeight*h*this.hFactor)/this.standardHeight)
        return h;
    },
    convertSize(size) {
        if (this.standardDevice) {
            return size;
        }
        size = ((this.deviceHeight*size)/this.standardHeight)
        return size;
    },
    fontSize (size) {
        if (this.standardDevice) {
            return size;
        }
        size = ((this.deviceHeight*size)/this.standardHeight)
        return size;
    },
    getDeviceWidth() {
        return this.deviceWidth
    },
    getDeviceHeight() {
        return this.deviceHeight
    }
}

export default sizeCalculator;