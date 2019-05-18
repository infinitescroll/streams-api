export const determineThreadConfig = streamType => {
  let type
  let sharing
  switch (streamType) {
    case 'shared':
      type = 'open'
      sharing = 'shared'
      break
    case 'public':
      type = 'public'
      sharing = 'invite_only'
      break
    case 'private':
      type = 'private'
      sharing = 'invite_only'
      break
    default:
      type = 'private'
      sharing = 'invite_only'
  }

  return { type, sharing }
}

export const ensureValidStreamType = streamType => {
  if (
    streamType !== 'public' &&
    streamType !== 'private' &&
    streamType !== 'shared'
  ) {
    throw new Error('streamType must be "shared", "public", "private"')
  }
}
