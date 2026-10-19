// Sub-Store 文件脚本：把订阅节点写入 Surge 模板的 [Proxy] 段
// 用法：在 Sub-Store 新建文件，来源选远程，填本仓库 surge 分支模板的 raw 链接，
// 再添加脚本操作，填本脚本的 raw 链接并在后面加参数，例如：
//   https://raw.githubusercontent.com/rkongzy/singbox_proxy_config/surge/scripts/surge-template.js#type=组合订阅&name=机场&url=文件的下载链接
// 参数：
//   name      订阅名或组合订阅名，必填
//   type      填 组合订阅、collection 或 1 时按组合订阅处理，其余按单条订阅处理
//   url       这个文件自己的下载链接，填了会在开头写入 #!MANAGED-CONFIG，Surge 可以自动更新整份配置
//   interval  自动更新间隔，单位秒，默认 86400

const { type = '', name, url, interval = '86400' } = $arguments

if (!name) throw new Error('缺少参数 name')

const isCollection = /^1$|col|组合/i.test(type)

const proxies = await produceArtifact({
  type: isCollection ? 'collection' : 'subscription',
  name,
  platform: 'Surge',
})

const lines = String(proxies || '')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.startsWith('#') && !l.startsWith('//'))

if (lines.length === 0) throw new Error(`订阅 ${name} 没有可用的 Surge 节点`)

let content = $content.replace(/^#!MANAGED-CONFIG.*\r?\n?/m, '')

const proxySection = /^\[Proxy\][^\S\r\n]*$/m
if (!proxySection.test(content)) throw new Error('模板里没有 [Proxy] 段')

content = content.replace(proxySection, () => `[Proxy]\n${lines.join('\n')}`)

if (url) {
  content = `#!MANAGED-CONFIG ${url} interval=${interval} strict=false\n` + content
}

$content = content
