/*
 * @Author: huangwenhao
 * @Create: 2021-02-10 14:35:01
 * @Description: description
 */
export default {
  name: "SdColumn",
  functional: true,
  props: {
    render: {
      type: Function,
      default: undefined
    },
    onClick: {
      type: Function,
      default: undefined
    },
    commands: {
      type: Array,
      default: undefined
    },
    groups: {
      type: Array,
      default: undefined
    }
  },
  render(h, context) {
    const { data, props, listeners } = context;
    const { render, onClick, commands, groups } = props;
    let scopedSlots = null;
    if (render) {
      scopedSlots = {
        default: scope => {
          return render(h, scope);
        }
      };
    }
    if (onClick) {
      scopedSlots = {
        default: scope => {
          return (
            <span
              class="text-primary is-btn"
              on-click={() => {
                onClick(scope);
              }}
            >
              {scope.row[data.attrs.prop]}
            </span>
          );
        }
      };
    }
    // 操作列
    if (commands || groups) {
      data.attrs = Object.assign(
        {},
        {
          width: 200,
          label: "操作"
        },
        data.attrs
      );
      scopedSlots = {
        default: scope => {
          const buttons = [];
          commands.forEach(item => {
            const {
              visibleFunc,
              disabledFunc,
              label,
              command,
              type = "text",
              children
            } = item;
            if (children) {
              // 有children当做操作组处理
              // 是否显示
              const visible = visibleFunc && visibleFunc(scope.row);
              // 所有子类是否都显示
              const visibleItems = children.filter(
                v => !v.visibleFunc || v.visibleFunc(scope.row)
              );
              if (visible && visibleItems.length) {
                // 是否可用
                const disabled = disabledFunc && disabledFunc(scope.row);
                const menus = [];
                visibleItems.forEach(item => {
                  const {
                    disabledFunc: disabledFn,
                    label: labelItem,
                    command: commandItem
                  } = item;
                  const disabledItem = disabledFn && disabledFn(scope.row);
                  menus.push(
                    <el-dropdown-item
                      command={commandItem}
                      disabled={disabledItem}
                    >
                      {labelItem}
                    </el-dropdown-item>
                  );
                });
                buttons.push(
                  <el-dropdown
                    trigger="click"
                    on-command={cmd => {
                      listeners["handle-operate"](cmd, scope);
                    }}
                    on-visible-change={(cmd) => {
                      listeners["visible-change"](cmd, scope, item)
                    }}
                  >
                    <el-button type="text" disabled={disabled}>
                      {label}
                      <i class="el-icon-arrow-down el-icon__down" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">{menus}</el-dropdown-menu>
                  </el-dropdown>
                );
              }
            } else if (!visibleFunc || visibleFunc(scope.row)) {
              const disabled = disabledFunc && disabledFunc(scope.row);
              buttons.push(
                <el-button
                  type={type}
                  disabled={disabled}
                  on-click={() => {
                    listeners["handle-operate"](command, scope);
                  }}
                >
                  {label}
                </el-button>
              );
            }
          });

          return buttons.length ? (
            <div class="sd-table__operation">{buttons}</div>
          ) : null;
        }
      };
    }
    if (scopedSlots) {
      return <el-table-column props={data.attrs} scopedSlots={scopedSlots} />;
    }
    return <el-table-column key={data.key} props={data.attrs} />;
  }
};
