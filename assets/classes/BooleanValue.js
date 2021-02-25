import BaseClass from './BaseClass'

export default class BooleanValue extends BaseClass {
  constructor(product) {
    let structure = {
      true_value: {
        type: 'string',
        required: true,
        description: '真值含义',
      },
      false_value: {
        type: 'string',
        required: true,
        description: '假值含义',
      },
    }
    super(product, structure)
  }
}
