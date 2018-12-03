
# Graph Compare Panel

基于[grafana-graph-panel](https://github.com/CorpGlory/grafana-graph-panel) 实现，主要解决问题： https://github.com/grafana/grafana/issues/2093

这是一个panel插件，可以在同一个面板上进行同环比曲线展示。

Time shift支持以下单位：s（秒），m（分钟），h（小时），d（天），w（周），M（月），y（年）

仅适用于Grafana版本> = V5.0.1

# 截图

![Screenshot1](/dist/screenshots/image-1.png)

![Screenshot2](/dist/screenshots/image-2.png)


# 安装

将此项目克隆到grafana plugins目录中（如果使用软件包安装grafana，则默认为/ var / lib / grafana / plugins）。 重新启动grafana，应检测并自动使用面板插件。

# 用法

* 创建dashboard并选择Graph Compare Panel插件。
* 创建一个基本查询
* 在compareTime标签页上添加Time shift

# 致谢


* [grafana](https://github.com/grafana/grafana)
* [grafana-graph-panel](https://github.com/CorpGlory/grafana-graph-panel)
* [@types/grafana](https://github.com/CorpGlory/types-grafana)

Made by [AutoHome Team](https://github.com/AutohomeCorp)
