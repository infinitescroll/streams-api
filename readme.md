# Instructions

#### Install

`npm i -s streams-api`

#### Create a new StreamAPI instance:

```js
import StreamAPI from 'streams-api'

const streamAPI = new StreamAPI()
```

The `StreamAPI` constructor takes an optional `textile config` object to overwrite the default:

```js
// local textile config
const config = {
  url: 'http://127.0.0.1',
  port: 40600,
  config: {
    API: {
      HTTPHeaders: '*'
    }
  }
}

const streamAPI = new StreamAPI(config)
```

The default config is your local textile node.

## Create a Stream:

```js
const newStream = await streamAPI.createStream(streamName, streamType)
```

_params:_

- streamName (string): The name of the stream
- streamType (string): The type of stream (one of `'public'`, or `'private'`)

_returns:_

- a stream object (object)

## Fetching data

#### Get a list of users' streams:

```js
const streamList = await streamAPI.getStreams(peerId)
```

_params:_

- peerId (string) - a textile peerId

_returns:_

- an array of stream objects (array)

#### Get all events from an individual stream

```js
const streamEvents = await streamAPI.getStreamEvents(streamId)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)

_returns:_

- an array of stream events (array)

#### Get all comments associated with a particular stream event

```js
const streamEvents = await streamAPI.getStreamEvents(streamId)
```

_params:_

- streamEventId (string) - the hash associated with a stream event (really the textile block hash)

_returns:_

- an array of stream comments (array)

## Adding data to streams

#### Add a new file to a stream

```js
const updatedStream = await streamAPI.addFile(streamId, file)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- file (buffer) - the file to add to a stream

_returns:_

- an updated stream object (object)

#### Send a message in a stream

```js
const updatedStream = await streamAPI.sendMessage(streamId, messageObject)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- message ?

_returns:_

- an updated stream object (object)

#### Add a new comment to a stream event

```js
const updatedStream = await streamAPI.sendMessage(streamId, messageObject)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- comment ?

_returns:_

- an updated stream object (object)
