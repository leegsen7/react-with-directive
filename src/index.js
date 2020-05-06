import React from 'react'

const reactCreateElement = React.createElement
const directives = new Map()

/**
 * 校验指令名称及去重
 * @param name
 */
const checkDirective = name => {
 if (directives.has(name)) {
   console.error(`The directive name: r-${name} is registered!!!`)
   return false
 }
 if (!/[a-zA-Z][a-zA-Z\-]?^$/.test(name)) {
   console.error(`The directive name: r-${name} is invalid!!!`)
   return false
 }
 return true
}

/**
 * 检查指令配置
 * @param options
 */
const checkOptions = options => {
  if (typeof options !== 'object' || options === null || Array.isArray(options)) {
    console.error(`The directive options must be object, current options: ${options}`)
    return false
  }
  if (typeof options.install !== 'function') {
    console.error(`The directive options param install must be function, current install: ${options.install}`)
    return false
  }
  return true
}

/**
 * 获取指令
 * @param props
 */
const getDirectives = props => {
  return Object.keys(props || {}).filter(([name]) => {
    return /^r-/.test(name)
  }).map(item => ({
    name: item[0].substring(2),
    value: item[1],
  }))
}

/**
 * 定义注册指令
 * @param name-指令名称
 * @param opitons-指令配置
 */
export const defineDirective = (name, opitons) => {
  if (!checkDirective(name) || !checkOptions((opitons))) {
    return false
  }
  directives.set(name, {
    priority: 1000,
    ...opitons,
  })
}

React.createElement = (type, props, ...childrens) => {
  // 获取匹配指令的list，并根据优先级排序
  const list = getDirectives(props).reduce((pre, cur) => {
    const opitons = directives.get(cur.name)
    if (!opitons) {
      return pre
    }
    return [
      ...pre,
      {
        ...cur,
        opitons,
      },
    ]
  }, []).sort((a, b) => a.priority - b.priority)
  if (!list.length) {
    return reactCreateElement(type, props, ...childrens)
  }
}
