import { StreamAPI } from '../dist'
import randomStreamName from './randomStreamName'
import { mockStream } from './mockObjects'

describe('createStream', () => {
  const { createStream } = new StreamAPI()
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
