import checker from './checkers'

export default class BaseClass {
  constructor(base, structure = {}) {
    if (!base) {
      base = {}
    } else {
      let { result, message } = checker.check(base, structure)
      if (!result) {
        // throw new Error(message)
        console.debug(message)
      }
    }

    for (let key in base) {
      if (base[key] !== undefined) {
        this[key] = base[key]
      }
    }
    for (let key in structure) {
      if (this[key] !== undefined) continue
      if (structure[key].type === 'array' || structure[key].type === 'enum') {
        this[key] = []
        continue
      }
      if (structure[key].type === 'object') {
        this[key] = {}
        continue
      }
      if (structure[key].type === 'number') {
        this[key] = 0
        continue
      }
      if (structure[key].type === 'string') {
        this[key] = ''
        continue
      }
      if (structure[key].type === 'boolean') {
        this[key] = false
        continue
      }
      if (typeof(structure[key].type) === 'function') {
        this[key] = new structure[key].type()
        continue
      }
    }
    Object.defineProperty(this, '$Structure', {
      value: structure,
      enumerable: false,
    })
  }
  toRemoteObj() {
    let obj = {}
    for (let key in this) {
      if (key == '$Structure') {
        continue
      }
      obj[key] = this[key]
    }
    return obj
  }
  trim() {
    for (let key in this) {
      if (key !== '$Structure' && !(key in this.$Structure)) {
        delete this[key]
      }
    }
    return this
  }
}
