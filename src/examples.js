import fs from 'fs'
import path from 'path'
import StreamAPI from './'

const example = async () => {
  const streamAPI = new StreamAPI()
  const createdStream = await streamAPI.createStream('test', 'public')
  const pathName = path.join(__dirname, 'utils.js')
  fs.readFile(pathName, async (err, file) => {
    if (err) throw err
    const streamEvent = await streamAPI.addFile(
      createdStream.id,
      file,
      'utils.js',
      '2kb',
      'a utility file'
    )
    console.log(streamEvent)
  })
}

example()
