# Instructions

## Developing an application using a local instance of streams-api

Use `npm link`:

In the root of `streams-api` repository, run `npm link`

In the same level of your directory as your `package.json`, run `npm link streams-api`.


As of now, we use a simple babel parser to transpile javascript. There is no hot-module-reloading.

Make sure to run `npm run build` after every code update to see the change take effect

#### Install

`npm i -s streams-api`

#### Create a new StreamAPI instance:

```js
import StreamAPI from 'streams-api'

const streamAPI = new StreamAPI()
```

The `StreamAPI` constructor takes an optional `textile config` object to overwrite the default:

```js
const textileConfig = {
  url: 'http://127.0.0.1',
  port: 40600,
  config: {
    API: {
      HTTPHeaders: '*'
    }
  }
}

const streamAPI = new StreamAPI(textileConfig)
```

The default config is your local textile node.

## Create a Stream:

Note - this is very simple on purpose - because this api interface will not have to change when the [new role based](https://github.com/textileio/go-textile/issues/694) thread access control is implemented.

Types of streams we support and what they mean:

- private - only you can read, write, comment, and invite others to the stream. Upon inviting another peer, you can specify what permissions they have.
- public - Anyone can read and comment, but only invitees can write and invite others
- shared - permissionless stream (everyone has all capabilities)
(have to check and make sure this is all possible today)

For simplicity's sake and an initial implementation, here's how the params passed in for streamType align with textile thread sharing permissions down into Textile:

shared ==> _type:_ 'open', _sharing:_ 'shared' <br />
public ==> _type:_ 'public', _sharing:_ 'invite_only' <br />
private ==> _type:_ 'private', _sharing:_ 'invite_only' <br />

```js
const newStream = await streamAPI.createStream(streamName, streamType)
```

_params:_

- streamName (string): The name of the stream
- streamType (string): The type of stream (one of `'shared', 'public'`, or `'private'`)

_returns:_

- a stream object (object) (see bottom of readme for stream object example)

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
const streamEvents = await streamAPI.getComments(streamEventId)
```

_params:_

- streamEventId (string) - the hash associated with a stream event (really the textile block hash)

_returns:_

- an array of stream comments (array)

#### Get a file

```js
const streamEvents = await streamAPI.getFile(fileHash)
```

_params:_

- fileHash (string) - the hash of a file

_returns:_

- the file (a buffer)

#### Get all comments associated with a particular stream event

```js
const streamEvents = await streamAPI.getComments(streamEventId)
```

_params:_

- streamEventId (string) - the hash associated with a stream event (really the textile block hash)

_returns:_

- an array of stream comments (array)

## Adding data to streams

#### Add a new file to a stream

```js
const updatedStream = await streamAPI.addFile(streamId, file, fileName, fileSize, caption)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- file (buffer or formData) - the file to add to a stream
- fileName (string)
- fileSize (string)
- caption (string)

_returns:_

- the new streamEvent object (object)

#### Send a message in a stream

The idea here is to pass an object instead of a simple string for a couple reasons:

1. We add more control to what we can do under the hood within the API. For example, we can add `TYPE`s, file pointers, and other things we might not foresee now
2. It could even include files, which the API parses and adds separately as files blocks to a thread
3. Easier to make changes without breaking the API

Ideally this `messageObject` can be the same as the `commentObject` (see below)

```js
const updatedStream = await streamAPI.sendMessage(streamId, messageObject)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- message ?

_returns:_

- an updated stream object (object)

#### Add a new comment to a stream event

Ideally this `commentObject` can be identical to the `messageObject` above. This allows for easy type checking and consistency in parsing these types of blocks

```js
const updatedStream = await streamAPI.addComment(streamEventId, commentObject)
```

_params:_

- streamEventId (string) - the ID associated with a stream (really the textile block ID)
- comment ?

_returns:_

- an updated stream object (object)

## Subscriptions

The streams API can provide event listeners to hear and react to different types of events

## Invites

#### Send an invite to a peer

```js
const successfulInvite = await streamAPI.invite(streamId, peerId)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- peerId (string) - the peerID to invite

_returns:_

- successfulInvite (bool) - true if invite was successfully sent

#### Generate an external peer invite URL

```js
const inviteLink = await streamAPI.invite(streamId, peerId)
```

_params:_

- streamId (string) - the ID associated with a stream (really the textile threadId)
- peerId (string) - the peerID to invite

_returns:_

- inviteLink (string) - a one time URL the peerId can use to join a stream

## Example Objects

#### Stream

```js
{
  id: '12D3KooWNMh7RHQZL9SdtCX9B1KMACGa2PtaEy8TDjvYMsKirFWZ',
  key: '1LPR4WmTea8kgWXmdWMCPd7G8EQ',
  sk:
    'CAESQLkpiNfnP1E1xcho5ch68/FtUqHq2XD5K2+jFyDSrpptulKqr+IIIBACd/Fdx+jsnf/oCOrG7426bbUy/z7i8KI=',
  name: 'test',
  schema: 'QmQn4hHm42sou9YFWSCAsmHJ7kCAf2cXU9TXQTxS5CLdvL',
  initiator: 'P8titHG6A1mTbWR2XpTvBfigcAWiiKJWWC69Za6W3nax6Jxu',
  type: 'PUBLIC',
  sharing: 'INVITE_ONLY',
  whitelist: [],
  state: 'LOADED',
  head: 'QmYPa9qYvpBusix8FCFNS6FPZ7PU2Ve2Dt4qe2ykzGxvff',
  head_block:
    {
      id: 'QmYPa9qYvpBusix8FCFNS6FPZ7PU2Ve2Dt4qe2ykzGxvff',
      thread: '12D3KooWNMh7RHQZL9SdtCX9B1KMACGa2PtaEy8TDjvYMsKirFWZ',
      author: '12D3KooWRSAs7PnrN4pnbemMgnPqrBPXYDEMdacmxyrwcTZ6hhvp',
      type: 'JOIN',
      date: '2019-05-18T13:52:34.145196Z',
      parents: [],
      user:
        {
          address: 'P8titHG6A1mTbWR2XpTvBfigcAWiiKJWWC69Za6W3nax6Jxu',
          name: 'P8titHG'
        }
    },
  schema_node: { name: 'blob', pin: true, mill: '/blob' },
  block_count: 1,
  peer_count: 1
}
```


#### Stream Event

```js
{
  block: 'QmSrgoqxryH89rdLT3GcgG5CTz6sELNVNAL55SQxGkJ9PM',
  target: 'QmcEh3akxehXGegjzkh13C366EWEFUxeUabqxeHfMznoTX',
  date: '2019-05-19T17:28:27.039685Z',
  user: {
    address: 'P8titHG6A1mTbWR2XpTvBfigcAWiiKJWWC69Za6W3nax6Jxu',
    name: 'P8titHG'
  },
  caption: 'caption',
  files: [{ file: [Object] }],
  comments: [],
  likes: [],
  threads: ['12D3KooWFNpGSMtKeLg1cdx4V2aipicxUbuy2sBwpqvcSNq2iP4X']
}
```
