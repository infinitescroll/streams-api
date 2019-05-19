import fs from 'fs'
import path from 'path'
import StreamAPI from '../dist'
import randomStreamName from './randomStreamName'
const {
  createStream,
  getStreamEvents,
  addFile,
  getFile,
  getFileFromBlock
} = new StreamAPI()

describe('createStream', () => {
  test('throws an error if streamName is not a truthy string', async () => {
    await expect(createStream(null, 'public')).rejects.toThrow()
    await expect(createStream(0, 'public')).rejects.toThrow()
    await expect(createStream([], 'public')).rejects.toThrow()
    await expect(createStream({}, 'public')).rejects.toThrow()
    await expect(createStream(false, 'public')).rejects.toThrow()
    await expect(createStream('', 'public')).rejects.toThrow()
    await expect(createStream(undefined, 'public')).rejects.toThrow()
  })

  test('throws an error if streamType is not of type "shared", public", "private"', async () => {
    await expect(createStream('test', '')).rejects.toThrow()
    await expect(createStream('test', 0)).rejects.toThrow()
    await expect(createStream('test', {})).rejects.toThrow()
    await expect(createStream('test', [])).rejects.toThrow()
    await expect(createStream('test', null)).rejects.toThrow()
    await expect(createStream('test', 'puublic')).rejects.toThrow()

    await expect(createStream('test', 'shared')).resolves.not.toThrow()
    await expect(createStream('test1', 'public')).resolves.not.toThrow()
    await expect(createStream('test2', 'private')).resolves.not.toThrow()
    await expect(createStream('test')).resolves.not.toThrow()
  })

  test('returns a stream object', async () => {
    const randomStream = randomStreamName()
    const newStream = await createStream(randomStream)
    expect(newStream).toHaveProperty('id')
    expect(newStream).toHaveProperty('name', randomStream)
    expect(newStream).toHaveProperty('schema')
    expect(newStream).toHaveProperty('head')
    expect(newStream).toHaveProperty('initiator')

    // TODO: add tests here to make sure right type of stream was instantiated based on passed in args
  })
})

describe('getStreamEvents', () => {
  test('throws an error if streamId is not a truthy string', async () => {
    await expect(createStream('')).rejects.toThrow()
    await expect(createStream(null)).rejects.toThrow()
    await expect(createStream({})).rejects.toThrow()
    await expect(createStream()).rejects.toThrow()
    await expect(createStream(false)).rejects.toThrow()
    await expect(createStream(0)).rejects.toThrow()
    await expect(createStream(2)).rejects.toThrow()
  })

  test('returns a list of stream events', async done => {
    const randomStream = randomStreamName()
    const { id } = await createStream(randomStream)
    const pathName = path.join(__dirname, 'mockObjects.js')
    fs.readFile(pathName, async (err, file) => {
      if (err) throw err
      await addFile(id, file)
      const streamEvents = await getStreamEvents(id)
      expect(Array.isArray(streamEvents)).toBe(true)
      expect(streamEvents.length).toBe(2)
      expect(streamEvents[0]).toHaveProperty('block')
      expect(streamEvents[0]).toHaveProperty('thread')
      expect(streamEvents[0]).toHaveProperty('payload')
      done()
    })
  })
})

describe('addFile', () => {
  test('it throws an error if streamID is not a truthy string', async () => {
    await expect(addFile('')).rejects.toThrow()
    await expect(addFile(null)).rejects.toThrow()
    await expect(addFile({})).rejects.toThrow()
    await expect(addFile()).rejects.toThrow()
    await expect(addFile(false)).rejects.toThrow()
    await expect(addFile(0)).rejects.toThrow()
    await expect(addFile(2)).rejects.toThrow()
  })

  test('it throws an error if file is not a buffer or form field', async () => {
    // TODO: can't test form field data without adding an extra dependency
    await expect(addFile('yo', 'not buffer')).rejects.toThrow()
  })

  test('it adds a file to the stream', async done => {
    const randomStream = randomStreamName()
    const { id } = await createStream(randomStream)
    const pathName = path.join(__dirname, 'mockObjects.js')
    fs.readFile(pathName, async (err, file) => {
      if (err) throw err
      const streamEvent = await addFile(id, file)
      expect(streamEvent).toHaveProperty('block')
      expect(streamEvent).toHaveProperty('target')
      expect(streamEvent).toHaveProperty('date')
      expect(streamEvent).toHaveProperty('user')
      expect(streamEvent).toHaveProperty('threads')
      expect(streamEvent).toHaveProperty('likes')
      expect(streamEvent).toHaveProperty('files')
      expect(streamEvent).toHaveProperty('caption')
      done()
    })
  })

  test('it adds the caption properly', async done => {
    const randomStream = randomStreamName()
    const { id } = await createStream(randomStream)
    const pathName = path.join(__dirname, 'mockObjects.js')
    fs.readFile(pathName, async (err, file) => {
      if (err) throw err
      const fileName = 'sampleFileName'
      const fileSize = '22kb'
      const caption = 'i love writing tests!'
      const streamEvent = await addFile(id, file, fileName, fileSize, caption)
      expect(typeof streamEvent.caption).toBe('string')
      const metadata = JSON.parse(streamEvent.caption)
      expect(metadata).toMatchObject({ fileName, fileSize, caption })
      done()
    })
  })
})

describe('getFile', () => {
  test('it throws an error if fileHash is not a truthy string', async () => {
    await expect(getFile('')).rejects.toThrow()
    await expect(getFile(null)).rejects.toThrow()
    await expect(getFile({})).rejects.toThrow()
    await expect(getFile()).rejects.toThrow()
    await expect(getFile(false)).rejects.toThrow()
    await expect(getFile(0)).rejects.toThrow()
    await expect(getFile(2)).rejects.toThrow()
  })

  test('it returns the content of a file given a hash', async done => {
    const randomStream = randomStreamName()
    const { id } = await createStream(randomStream)
    const pathName = path.join(__dirname, 'mockObjects.js')
    fs.readFile(pathName, async (err, file) => {
      if (err) throw err
      const fileName = 'sampleFileName'
      const fileSize = '22kb'
      const caption = 'i love writing tests!'
      const { files } = await addFile(id, file, fileName, fileSize, caption)
      const fileContent = await getFile(files[0].file.hash)
      const buffer = fileContent[Object.getOwnPropertySymbols(fileContent)[1]]
      expect(Buffer.isBuffer(buffer)).toBe(true)
      expect(buffer.equals(file)).toBe(true)
      done()
    })
  })
})

describe('getFileFromBlock', () => {
  test.skip('it throws an error if blockId is not a truthy string', async () => {
    await expect(getFileFromBlock('')).rejects.toThrow()
    await expect(getFileFromBlock(null)).rejects.toThrow()
    await expect(getFileFromBlock({})).rejects.toThrow()
    await expect(getFileFromBlock()).rejects.toThrow()
    await expect(getFileFromBlock(false)).rejects.toThrow()
    await expect(getFileFromBlock(0)).rejects.toThrow()
    await expect(getFileFromBlock(2)).rejects.toThrow()
  })

  test.skip('it throws an error if block is not a FILES block', async () => {})

  test.skip('it returns a file from the block', async done => {
    const randomStream = randomStreamName()
    const { id } = await createStream(randomStream)
    const pathName = path.join(__dirname, 'mockObjects.js')
    fs.readFile(pathName, async (err, file) => {
      if (err) throw err
      const fileName = 'sampleFileName'
      const fileSize = '22kb'
      const caption = 'i love writing tests!'
      const result = await addFile(id, file, fileName, fileSize, caption)
      console.log(result.files[0].file.hash)
      const res = await getFileFromBlock(result.block)
      // const fileContent = await getFile(files[0].file.hash)
      // const buffer = fileContent[Object.getOwnPropertySymbols(fileContent)[1]]
      // expect(Buffer.isBuffer(buffer)).toBe(true)
      // expect(buffer.equals(file)).toBe(true)
      done()
    })
  })
})
