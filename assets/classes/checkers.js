export const check = (obj, proto) => {
  for (let key in proto) {
    let protoItem = proto[key]
    let item = obj[key]
    if (protoItem.required && (item === undefined || item === null)) {
      return {
        result: false,
        message: `missing required field ${key}`,
      }
    }
    let type = protoItem.type
    if (type === 'enum') {
      if (!Array.isArray(item)) {
        return {
          result: false,
          message: `field ${key} should be enum but got ${ typeof(item) }`,
        }
      }
      for (let enumItem of item) {
        if (protoItem.enum.getDisplay(enumItem) === null) {
          return {
            result: false,
            message: `invalid enum item ${typeof (enumItem)} in field ${key}`,
          }
        }
      }
    } else if (type !== typeof(item) && !((type === 'array') && Array.isArray(item))) {
      return {
        result: false,
        message: `field ${ key } should be ${ type } but got ${ typeof(item) }`,
      }
    }
    return {
      result: true,
      message: 'success',
    }
  }
}

export default {
  check,
}
