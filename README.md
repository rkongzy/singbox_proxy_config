# Surge 配置模板

用法和 sing-box 分支一样：Sub-Store 拉取模板，用脚本填入节点，Surge 直接订阅 Sub-Store 输出的完整配置。

- `standard/surge.conf`：配置模板，分组和 sing-box standard 版一致，规则使用 [Loyalsoldier/surge-rules](https://github.com/Loyalsoldier/surge-rules)
- `scripts/surge-template.js`：Sub-Store 文件脚本，把订阅节点写入模板的 `[Proxy]` 段，可选写入 `#!MANAGED-CONFIG` 让 Surge 自动更新

模板链接：`https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/standard/surge.conf`

脚本链接：`https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/scripts/surge-template.js#type=组合订阅&name=订阅名&url=文件下载链接`

Surge 不支持 Tailscale，模板里没有 Tailscale 相关内容。
