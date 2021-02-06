export const setFormItems = (dataObj, formObj) => {
  let item = {}
  let targetObj = formObj.getFieldsValue()
  for (let key in targetObj) {
    item[key] = dataObj[key]
  }
  formObj.setFieldsValue(item)
}
