export const ensureTruthyString = (param, fieldName) => {
  if (!param) throw new Error(`${fieldName} cannot be left empty`)
  if (typeof param !== 'string')
    throw new Error(`${fieldName} must be a string`)
}
