import { Textile } from '@textile/js-http-client'
import { ensureTruthyString, ensureBufferOrFormData } from './utils'
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

  addFile = async (streamId, file, fileName, fileSize, caption) => {
    ensureTruthyString(streamId, 'streamId')
    ensureBufferOrFormData(file)
    try {
      const metadata = JSON.stringify({ fileName, fileSize, caption })
      const streamEvent = await this.textile.files.add(file, metadata, streamId)
      return streamEvent
    } catch (error) {
      throw new Error(`Error adding file to your stream: ${error}`)
    }
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

  getStreamEvents = async (streamId, start = 0, limit = 100000) => {
    ensureTruthyString(streamId, 'streamId')
    try {
      const { items } = await this.textile.feed.list(streamId, start, limit)
      return items
    } catch (error) {
      throw new Error(`Error getting stream events: ${error}`)
    }
  }

  getFile = async fileHash => {
    ensureTruthyString(fileHash)
    try {
      return this.textile.file.content(fileHash)
    } catch (error) {
      throw new Error(`Error getting your file data: ${error}`)
    }
  }

  getFileFromBlock = async blockId => {
    ensureTruthyString(blockId)
    let block
    try {
      block = await this.textile.blocks.get(blockId)
    } catch (error) {
      throw new Error(`Error finding the block: ${blockId}, error: ${error}`)
    }

    if (block.type !== 'FILES')
      throw new Error(`${blockId} is not a FILES block`)
  }
}

export default StreamAPI
