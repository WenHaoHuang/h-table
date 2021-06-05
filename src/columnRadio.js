/*
 * @Author: wenhao.huang
 * @Github: https://github.com/WenHaoHuang
 * @Create: 2021-02-13 14:08:26
 */
export default {
  name: "SdColumnRadio",
  props: {
    rowKey: {
      type: String,
      default: undefined
    },
    defaultKeys: {
      type: Array,
      default: undefined
    },
    disabled: {
      type: [Boolean, Function],
      default: undefined
    }
  },
  render() {
    const { rowKey, defaultKeys } = this;
    const scopedSlots = {
      default: ({row}) => {
        const valueItem = row[rowKey];
        const selected =
          defaultKeys &&
          rowKey !== undefined &&
          defaultKeys.includes(valueItem);
        let { disabled } = this;
        if (typeof disabled === "function") {
          disabled = disabled(row);
        }
        return (
          <sn-radio
            class="h-table__radio"
            value={selected}
            label={true}
            disabled={disabled}
            on-input={() => {
              this.$emit("selection-change", [row], valueItem);
            }}
          />
        );
      }
    };
    return (
      <sn-table-column
        key={defaultKeys && defaultKeys[0]}
        props={this.$attrs}
        scopedSlots={scopedSlots}
      />
    );
  }
};
