## react-with-directive，在react中注册使用指令

### 安装使用
`npm i react-with-directive -S`

### 注册指令
```javascript
import { defineDirective } from 'react-with-directive'

/**
* name[string]: 指令名称，列如if
* options[shape({
*   install[func],
* })]: 配置参数
*/
defineDirective(name, options)
```

### 内置指令
  - r-if: 真值则渲染元素，假值则不渲染
  - r-class: 支持数组或对象参数，可与className混用
    + r-class={[active && 'active', 'red']}
    + r-class={{ active, [style.container]: flag, root: true }}

### 如何使用
可以在组件或者普通元素上使用指令
```javascript
<Demo
  r-if={flag}
  value={value}
  onchange={val => console.log(val)}
>
  <div
    r-class={{
      [style.active]: active,
      red: true,
    }}
  >Helloe Wolrd!
  </div>
</Demo>
```
