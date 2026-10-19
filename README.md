# Surge 配置模板

用法和 sing-box 分支一样：Sub-Store 拉取模板，用脚本填入节点，Surge 直接订阅 Sub-Store 输出的完整配置。需要 Surge iOS 5.22.0 或更高版本。

- `standard/surge.conf`：分组和 sing-box standard 版一致
- `chain/surge.conf`：分组和 sing-box chain 版一致，落地节点通过 🔗 前置节点 连接
- `scripts/surge-template.js`：Sub-Store 文件脚本，写入节点，可选写入 Tailscale 密钥和 `#!MANAGED-CONFIG`

规则使用 [Loyalsoldier/surge-rules](https://github.com/Loyalsoldier/surge-rules)。Tailscale 使用 Surge 自带的 tailscale 策略，默认交互式登录，也可以通过脚本参数 `auth_key` 填入密钥。

模板链接：

- `https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/standard/surge.conf`
- `https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/chain/surge.conf`

脚本链接（参数说明见脚本开头）：

- standard：`https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/scripts/surge-template.js#collection=组合订阅&url=文件下载链接`
- chain：`https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/scripts/surge-template.js#collection=组合订阅&landing=落地节点&url=文件下载链接`
