const { Textile } = require('@textile/js-http-client')

const defaultTextileConfig = {
  url: 'http://127.0.0.1',
  port: 40600,
  config: {
    API: {
      HTTPHeaders: '*'
    }
  }
}

class Stream {
  constructor(config) {
    this.textile = new Textile(config || defaultTextileConfig)
  }

  sendMessage = () => {
    console.log(this.textile)
  }

  comment = () => {}
  create = () => {}
  get = () => {}
}

export default Stream
