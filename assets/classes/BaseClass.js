import checker from './checkers'

export default class BaseClass {
  constructor(base = {}, structure = {}) {
    this.$Structure = structure
    let { result, message } = checker.check(base, this.$Structure)
    if (!result) {
      // throw new Error(message)
      console.debug(message)
    }
    for (let key in base) {
      if (base[key] !== undefined) {
        this[key] = base[key]
      } else {
        if (this.$Structure[key] && (this.$Structure[key].type === 'array' || this.$Structure[key].type === 'enum')) {
          this[key] = []
        } else {
          this[key] = ''
        }
      }
    }
    for (let key in this.$Structure) {
      if (this[key] !== undefined) continue
      if (this.$Structure[key].type === 'array' || this.$Structure[key].type === 'enum') {
        this[key] = []
      } else {
        this[key] = ''
      }
    }
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
}
