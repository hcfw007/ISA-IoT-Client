import BaseClass from './BaseClass'

export default class NumberValue extends BaseClass {
  constructor(numberValue) {
    let structure = {
      max: {
        type: 'number',
        required: true,
        description: '最大值',
      },
      min: {
        type: 'number',
        required: true,
        description: '最小值',
      },
      step: {
        type: 'number',
        required: true,
        description: '步长',
      },
      unit: {
        type: 'string',
        required: true,
        description: '单位',
      },
    }
    super(numberValue, structure)
  }
}
