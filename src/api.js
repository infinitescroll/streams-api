import { Textile } from '@textile/js-http-client'
import { ensureTruthyString } from './utils'
import { determineThreadConfig, ensureValidStreamType } from './textile-helpers'

const defaultTextileConfig = {
  url: 'http://127.0.0.1',
  port: 40600,
  config: {
    API: {
      HTTPHeaders: '*'
    }
  }
}

class StreamAPI {
  constructor(config) {
    this.textile = new Textile(config || defaultTextileConfig)
  }

  createStream = async (streamName, streamType = 'private') => {
    ensureTruthyString(streamName, 'streamName')
    ensureTruthyString(streamType, 'streamType')
    ensureValidStreamType(streamType)

    try {
      const { blob } = await this.textile.schemas.defaults()
      const { hash } = await this.textile.schemas.add(blob)
      const { type, sharing } = determineThreadConfig(streamType)
      // LINE LIKELY TO CHANGE with https://github.com/textileio/go-textile/issues/694
      return this.textile.threads.add(streamName, hash, null, type, sharing)
    } catch (error) {
      throw new Error(`Error creating thread: ${error}`)
    }
  }

  getStreams = async peerId => {
    ensureTruthyString(peerId, 'peerId')
    return
    // https://github.com/textileio/docs/issues/74
  }

  getStreamEvents = async streamId => {
    ensureTruthyString(streamId, 'streamId')
    try {
      const { items } = await this.textile.blocks.list(streamId)
      return items
    } catch (error) {
      throw new Error(`Error getting stream events: ${error}`)
    }
  }
}

export default StreamAPI
