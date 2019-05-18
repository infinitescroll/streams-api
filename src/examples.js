import { StreamAPI } from './'

const createStream = async () => {
  const streamAPI = new StreamAPI()
  const createdStream = await streamAPI.createStream('test', 'public')
}

createStream()
