/**
 * r-class指令
 */
export default {
  getName(value) {
    if (typeof value === 'string') {
      return [value]
    }
    if (Array.isArray(value)) {
      return value.filter(Boolean)
    }
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).filter(item => item[1]).map(item => item[0])
    }
    return []
  },
  install({ value, props }) {
    const oldName = props.className || ''
    const addName = this.getName(value)
    return {
      className: [oldName, ...addName].filter(Boolean).join(' '),
    }
  },
}
