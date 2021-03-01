import BaseClass from './BaseClass'

export default class ExceptionValue extends BaseClass {
  constructor(exception) {
    let structure = {
      items: {
        type: 'array',
        required: true,
        description: '项目',
      },
    }
    super(exception, structure)
  }
}
