import React from 'react'
import * as defaultDirectives from './directives'

const omit = (value, keys) => {
  if (!keys.length) {
    return {...value}
  }
  return Object.entries(value).reduce((pre, cur) => {
    if (keys.includes(cur[0])) {
      return pre
    }
    return {
      ...pre,
      [cur[0]]: cur[1],
    }
  }, {})
}
const reactCreateElement = React.createElement
const directives = new Map()

/**
 * 校验指令名称及去重
 * @param name
 */
const checkDirective = name => {
  if (directives.has(name)) {
    console.error(`The directive name: ${name} is registered!!!`)
    return false
  }
  if (!/^[a-zA-Z]+[a-zA-Z\-]?[a-zA-Z]+$/.test(name)) {
    console.error(`The directive name: ${name} is invalid!!!`)
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
  return Object.keys(props || {}).filter(name => {
    return /^r-/.test(name)
  }).map(name => ({
    name,
    directive: name.substring(2),
    value: props[name],
  }))
}

/**
 * 定义注册指令
 * @param name-指令名称
 * @param options-指令配置
 */
export const defineDirective = (name, options) => {
  if (!checkDirective(name) || !checkOptions((options))) {
    return false
  }
  directives.set(name, {
    priority: 1000,
    ...options,
  })
}

React.createElement = (type, props, ...childrens) => {
  // 获取匹配指令的list，并根据优先级排序
  const list = getDirectives(props).reduce((pre, cur) => {
    const options = directives.get(cur.directive)
    if (!options) {
      return pre
    }
    return [
      ...pre,
      {
        ...cur,
        options,
      },
    ]
  }, []).sort((a, b) => a.priority - b.priority)
  if (!list.length) {
    return reactCreateElement(type, props, ...childrens)
  }
  let otherProps = omit(props || {}, list.map(item => item.name))
  const result = list.every(item => {
    const curRes = item.options.install({
      value: item.value,
      props: otherProps,
    })
    if (curRes === null) {
      return false
    }
    otherProps = Object.assign({}, otherProps, curRes)
    return true
  })
  if (!result) {
    return null
  }
  return reactCreateElement(type, otherProps, ...childrens)
}

Object.entries(defaultDirectives).forEach(([name, options]) => {
  defineDirective(name.replace(/^r([A-Z])/, (_, val) => val.toLowerCase()), options)
})

