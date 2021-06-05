:::title

## HTable 基于 element-ui 的后台管理系统框架快速搭建组件

基于 element-ui 的后台管理系统框架快速搭建组件

:::

### 简单使用

- 组件的简单使用场景

:::demo 通过 config 对组件进行配置

```html
<template>
  <h-table :data="data" :columns="columns" :pagination="pagination" />
</template>

<script>
  export default {
    data() {
      return {
        data: [
          {
            date: "2016-05-02",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1518 弄"
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1517 弄"
          },
          {
            date: "2016-05-01",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1519 弄"
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            address: "上海市普陀区金沙江路 1516 弄"
          }
        ],
        pagination: {
          total: 100,
          currentPage: 1,
          pageSize: 15,
          background: true,
          layout: "slot, total, ->, prev, pager, next"
        },
        columns: [
          {label: "日期", prop: "data"},
          {label: "姓名", prop: "name"},
          {label: "地址", prop: "address"}
        ]
      };
    },
    methods: {}
  };
</script>
```

:::

:::api

### Options

| 名称   | 说明 | 类型   | 可选值 | 默认值 |
| ------ | ---- | ------ | ------ | ------ |
| config | 说明 | object | -      | -      |
