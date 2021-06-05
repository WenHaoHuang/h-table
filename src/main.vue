<template>
  <div class="h-table">
    <el-table
      ref="table"
      class="h-table__table"
      :data="data"
      v-bind="$attrs"
      v-on="tableEvents"
    >
      <template v-for="(item, index) in columns">
        <sd-column-radio
          v-if="item.type === 'radio'"
          :key="item.prop || item.type || index"
          :row-key="$attrs['row-key']"
          :default-keys="defaultKeys"
          :disabled="item.disabled"
          v-bind="item"
          @selection-change="selectionChange"
        />
        <sd-column
          v-else
          :key="item.prop || item.type || index"
          v-bind="item"
        />
      </template>
      <sd-column
        v-if="showOperation"
        key="_operation"
        v-bind="operation"
        @handle-operate="handleOperate"
        @visible-change="visibleChange"
      />
    </el-table>
    <el-pagination
      class="h-table__pagination"
      v-bind="pagination"
      @size-change="sizeChange"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="pageChange"
    >
      当前 {{ pageStart }} 到 {{ pageEnd }} 条
    </el-pagination>
  </div>
</template>

<script>
import SdColumn from './column.js'
import SdColumnRadio from './columnRadio.js'

export default {
  name: 'HTable',
  components: { SdColumn, SdColumnRadio },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    pagination: {
      // 分页栏配置
      type: Object,
      default: () => ({
        total: 0,
        currentPage: 1,
        pageSize: 15,
        layout: 'slot, total, ->, prev, pager, next',
        hideOnSinglePage: true,
      }),
    },
    // 表格行配置
    columns: {
      type: Array,
      default: () => [],
    },
    // 操作列配置
    operation: {
      type: Object,
      default: () => ({
        commands: [],
      }),
    },
    // 默认选中的行
    selectedRowKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultKeys: undefined,
    }
  },
  computed: {
    tableEvents() {
      const events = { ...this.$listeners }
      const paginationEvents = ['page-change', 'size-change', 'prev-click', 'next-click', 'handle-operate', 'visible-change']
      paginationEvents.forEach((key) => {
        delete events[key]
      })
      return events
    },
    showOperation() {
      return this.operation && this.operation.commands && this.operation.commands.length
    },
    pageStart() {
      const { currentPage, pageSize } = this.pagination
      return pageSize * (currentPage - 1) + 1
    },
    pageEnd() {
      const { currentPage, pageSize, total } = this.pagination
      return Math.min(total, pageSize * currentPage)
    },
  },
  watch: {
    selectedRowKeys: {
      handler: function (val) {
        this.defaultKeys = val
        this.$nextTick(() => {
          this.handlerSelection()
        })
      },
      deep: true,
      immediate: true,
    },
    data: {
      handler: function () {
        this.$nextTick(() => {
          this.handlerSelection()
        })
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    pageChange(page) {
      this.$emit('page-change', page)
    },
    sizeChange(pageSize) {
      this.$emit('size-change', pageSize)
    },
    prevClick(page) {
      this.$emit('prev-click', page)
    },
    nextClick(page) {
      this.$emit('next-click', page)
    },
    handleOperate(command, scope) {
      this.$emit('handle-operate', command, scope)
    },
    visibleChange(command, scope, group) {
      this.$emit('visible-change', command, scope, group)
    },
    // 清除状态
    clearFilter(columnKey) {
      this.$refs.table.clearFilter(columnKey)
    },
    // 用于多选表格，清空用户的选择
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection() {
      this.$refs.table.toggleAllSelection()
    },
    // 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
    toggleRowExpansion(row, expanded) {
      this.$refs.table.toggleRowExpansion(row, expanded)
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row)
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort() {
      this.$refs.table.clearSort()
    },
    // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout() {
      this.$refs.table.doLayout()
    },
    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序
    sort(prop, order) {
      this.$refs.table.sort(prop, order)
    },
    selectionChange(selection, valueItem) {
      this.$emit('selection-change', selection)
      this.defaultKeys = [valueItem]
    },
    handlerSelection() {
      const { selectedRowKeys, $attrs, data } = this
      const { 'row-key': rowKey } = $attrs
      if (rowKey && selectedRowKeys && selectedRowKeys.length && data && data.length) {
        data.forEach((item) => {
          if (selectedRowKeys.includes(item[rowKey])) {
            this.$refs.table.toggleRowSelection(item, true)
          }
        })
      }
    },
  },
}
</script>
