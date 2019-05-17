const delay = () =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log('delayed!')
      resolve()
    }, 1000)
  })

const test = async () => {
  await delay()
}

test()

class StreamsAPI {}
