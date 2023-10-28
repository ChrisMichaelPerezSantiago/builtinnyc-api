import _ from 'lodash'
import qs from 'qs'

export function buildQuery<T>(obj: T): string {
  const query: Partial<T> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (value !== undefined && value !== null && value !== '')
        query[key] = value
    }
  }
  return qs.stringify(query, { encodeValuesOnly: true })
}

export function splitAndTrimTags(html: string) {
  // Unicode code point for the bullet character (•)
  const bullet = String.fromCharCode(0x2022)
  return _.map(html.split(bullet), _.trim)
}

export function buildPath(array: any) {
  if (_.size(array) === 1)
    return _.join(array)

  return _.join(array, '/')
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
};

export function isUrl(str: string) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return urlRegex.test(str)
}
