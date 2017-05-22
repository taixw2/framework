import Promise from './promise'

export default [{
  alias: '$promise',
  value(resolver) {
    return new Promise(resolver)
  },
}]
