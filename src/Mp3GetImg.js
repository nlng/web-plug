import { AEvent } from "./AEvent";

/**
 * 从MP3 提取 专辑图片
 *
 * @class Mp3GetImg
 */
class Mp3GetImg extends AEvent {
  constructor() {
    super();
    this.uint8 = [];
    this._event = {
      'url': [],
      'error': []
    }
    this.png = [];
    this.jpg = [];
  }

  async loadFile(file) {
    var arrayBuffer = await file.slice().arrayBuffer();
    this.uint8 = new Uint8Array(arrayBuffer)
    this.png = [];
    this.jpg = [];
    return this;
  }

  async loadArrayBuffer(arrayBuffer) {
    this.uint8 = new Uint8Array(arrayBuffer)
    this.png = [];
    this.jpg = [];
    return this;
  }

  async loadBlob(blob) {
    var arrayBuffer = await blob.arrayBuffer();
    this.uint8 = new Uint8Array(arrayBuffer)
    this.png = [];
    this.jpg = [];
    return this;
  }

  run() {

    var uint8 = this.uint8;
    for (var i = 0; i < uint8.length; i++) {
      // png
      if (uint8[i] === 137 && uint8[i + 1] === 80 && uint8[i + 2] === 78 && uint8[i + 3] === 71) {
        this.png[0] = i
      } else if (uint8[i] === 130 && uint8[i - 1] === 96 && uint8[i - 2] === 66 && uint8[i - 3] === 174) {
        this.png[1] = (i + 1)
        break;
        // jpg
      } else if (uint8[i] === 255 && uint8[i + 1] === 216 && uint8[i + 2] === 255) {
        if (this.jpg.length === 0) {
          this.jpg[0] = i
        }
      } else if (uint8[i] === 217 && uint8[i - 1] === 255) {
        if (this.jpg.length === 1) {
          this.jpg[1] = (i + 1)
          break;
        }
      }
    }
    this._toBlock()
    return this;
  }
  _toBlock() {
    // error
    if (this.png.length === 2 && this.jpg.length === 2) {
      this._emit('error', { type: 0, error: 'data error' })
      return;
    }
    // png
    if (this.png.length >= 2) {
      let entity = this.uint8.slice(...this.png)
      this._toBlob(entity, 'png');
      return;
    }
    // jpg
    if (this.jpg.length >= 2) {
      let entity = this.uint8.slice(...this.jpg)
      this._toBlob(entity, 'jpg')
      return;
    }

    // error
    this._emit('error', { type: 1, error: 'not find img' })
  }
  _toBlob(entity, type) {
    var buffer = new Uint8Array(entity).buffer;
    var blob = URL.createObjectURL(new Blob([buffer]))

    for (var fun of this._event['url']) {
      fun(type, blob);
      setTimeout(function () {
        URL.revokeObjectURL(blob)
      }, 0)
    }
    // console.log(this.href,this.end[this.index])
    // setTimeout(function(){
    //   URL.revokeObjectURL(_this.href)
    // },0)
  }
}


export {
  Mp3GetImg
}