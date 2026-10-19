// Sub-Store 文件脚本：把订阅节点写入 Surge 模板
// 用法：在 Sub-Store 新建文件，来源选远程，填 surge 分支里 standard 或 chain 模板的 raw 链接，
// 再添加脚本操作，填本脚本的 raw 链接并在 # 后面加参数。
//
// 参数：
//   collection  机场节点所在的组合订阅名，和 subscription 二选一
//   subscription 机场节点所在的单条订阅名
//   landing     落地节点所在的单条订阅名，chain 模板必填
//   url         这个文件自己的下载链接，可选。填了会写入 #!MANAGED-CONFIG，Surge 可以自动更新整份配置
//   interval    自动更新间隔，单位秒，默认 86400
//
// 例子：
//   standard：#collection=组合订阅&url=文件下载链接
//   chain：   #collection=组合订阅&landing=落地节点&url=文件下载链接

const { collection, subscription, landing, url, interval = '86400' } = $arguments

if (!collection && !subscription) throw new Error('缺少参数 collection 或 subscription')

async function getNodes(type, name) {
  const text = await produceArtifact({ type, name, platform: 'Surge' })
  const lines = String(text || '')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && !l.startsWith('//') && l.includes('='))
  if (lines.length === 0) throw new Error(`${name} 没有可用的 Surge 节点`)
  const names = lines.map(l => l.slice(0, l.indexOf('=')).trim())
  return { lines, names }
}

const airport = collection
  ? await getNodes('collection', collection)
  : await getNodes('subscription', subscription)

let content = $content.replace(/^#!MANAGED-CONFIG.*\r?\n?/m, '')
let proxyLines = [...airport.lines]

content = content.replace(/__AIRPORT_NODES__/g, () => airport.names.join(', '))

if (content.includes('__LANDING_NODES__')) {
  if (!landing) throw new Error('chain 模板需要参数 landing')
  const land = await getNodes('subscription', landing)
  const dup = land.names.filter(n => airport.names.includes(n))
  if (dup.length) throw new Error(`落地节点和机场节点重名：${dup.join(', ')}`)
  proxyLines = proxyLines.concat(land.lines)
  content = content.replace(/__LANDING_NODES__/g, () => land.names.join(', '))
}

const proxySection = /^\[Proxy\][^\S\r\n]*$/m
if (!proxySection.test(content)) throw new Error('模板里没有 [Proxy] 段')
content = content.replace(proxySection, () => `[Proxy]\n${proxyLines.join('\n')}`)


if (url) {
  content = `#!MANAGED-CONFIG ${url} interval=${interval} strict=false\n` + content
}

$content = content
