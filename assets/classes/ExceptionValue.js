import BaseClass from './BaseClass'

export default class BooleanValue extends BaseClass {
  constructor(product) {
    let structure = {
      items: {
        type: 'array',
        required: true,
        description: '项目',
      },
    }
    super(product, structure)
  }
}
