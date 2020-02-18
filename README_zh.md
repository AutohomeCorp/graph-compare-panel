# Graph Compare Panel

---

注意：

此插件已不再维护，我们替换为[同环比数据源插件](https://github.com/AutohomeCorp/grafana-compare-queries)

[Engilsh](README.md)

基于[grafana-graph-panel](https://github.com/CorpGlory/grafana-graph-panel) 实现，主要解决问题： https://github.com/grafana/grafana/issues/2093

这是一个 panel 插件，可以在同一个面板上进行同环比曲线展示。

Time shift 支持以下单位：s（秒），m（分钟），h（小时），d（天），w（周），M（月），y（年）

master 版本适用于 Grafana 版本 V5.0.1 - V5.3.4

graph-compare-panel-for-grafana-5.4.x 分支版本适用于 Grafana 版本 V5.4.x

# 截图

![Screenshot1](/dist/screenshots/image-1.png)

![Screenshot2](/dist/screenshots/image-2.png)

# 安装

将此项目克隆到 grafana plugins 目录中（如果使用软件包安装 grafana，则默认为/ var / lib / grafana / plugins）。 重新启动 grafana，应检测并自动使用面板插件。

# 用法

- 创建 dashboard 并选择 Graph Compare Panel 插件。
- 创建一个基本查询
- 在 compareTime 标签页上添加 Time shift

# 致谢

- [grafana](https://github.com/grafana/grafana)
- [grafana-graph-panel](https://github.com/CorpGlory/grafana-graph-panel)
- [@types/grafana](https://github.com/CorpGlory/types-grafana)
- [grafana-multibar-graph-panel](https://github.com/CorpGlory/grafana-multibar-graph-panel)

Made by [AutoHome Team](https://github.com/AutohomeCorp)
