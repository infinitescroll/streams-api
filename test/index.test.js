import { StreamAPI } from '../dist'

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

  test('throws an error if streamType is not either "public" or "private"', async () => {
    await expect(createStream('test', 'public')).resolves.not.toThrow()
    await expect(createStream('test', '')).rejects.toThrow()
    await expect(createStream('test', 0)).rejects.toThrow()
    await expect(createStream('test', {})).rejects.toThrow()
    await expect(createStream('test', [])).rejects.toThrow()
    await expect(createStream('test', null)).rejects.toThrow()
    await expect(createStream('test', 'puublic')).rejects.toThrow()
    // default to 'public' when no value is passed in
    await expect(createStream('test')).resolves.not.toThrow()
  })
})
