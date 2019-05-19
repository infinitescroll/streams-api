export const ensureTruthyString = (param, fieldName) => {
  if (!param) throw new Error(`${fieldName} cannot be left empty`)
  if (typeof param !== 'string')
    throw new Error(`${fieldName} must be a string`)
}

export const ensureBufferOrFormData = file => {
  if (!Buffer.isBuffer(file) && !file instanceof FormData)
    throw new Error(`File must be of type Buffer or FormData`)
}
