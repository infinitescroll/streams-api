import { Textile } from '@textile/js-http-client'
import { ensureTruthyString } from './utils'

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
    this.createStream = this.createStream.bind(this)
  }

  createStream = async (streamName, streamType = 'public') => {
    ensureTruthyString(streamName, 'streamName')
    ensureTruthyString(streamType, 'streamType')
    if (streamType !== 'public' && streamType !== 'private') {
      throw new Error('streamType must be "public" or "private"')
    }

    const blob = await this.textile.schemas.defaults()
    console.log('blob!', blob)
    // const schema = await textile.schemas.add(blob)
    // const thread = await textile.threads.add(thread_key, schema.id, thread_key, 'public', 'invite_only')
  }
}

export default Stream
