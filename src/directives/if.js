/**
 * r-if指令
 */
export default {
  install: ({ value }) => {
    if (!value) {
      return null
    }
  },
}
