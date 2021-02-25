import BaseClass from './BaseClass'

export default class EnumValue extends BaseClass {
  constructor(product) {
    let structure = {
      items: {
        type: 'array',
        required: true,
        description: '项目',
      },
      visible: {
        type: 'array',
        required: false,
        description: '可见性',
      },
    }
    super(product, structure)
  }
}
