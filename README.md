# Graph Compare Panel

---

[中文文档](README_zh.md)

Webpack copy of [grafana-graph-panel](https://github.com/CorpGlory/grafana-graph-panel) implementing https://github.com/grafana/grafana/issues/2093

This plugin is built as a panel plugin that combines and contrasts different time shifts on the same panel.

Time shift supports the following units: s (seconds), m (minutes), h (hours), d (days), w (weeks), M (months), y (years)

Branch 'master' Works only on Grafana versions V5.0.1 - V5.3.4

Branch 'graph-compare-panel-for-grafana-5.4.x' Works only on Grafana versions V5.4.x

# Screenshots

![Screenshot1](/dist/screenshots/image-1.png)

![Screenshot2](/dist/screenshots/image-2.png)

# Installation

Clone this project into the grafana plugins directory (if you install grafana with the package, the default is /var / lib / grafana / plugins). Restart grafana and the panel plugin should be detected and automatically used.

# Usage

- Create a dashboard and select the Graph Compare Panel plugin.
- Create a basic query
- Add time shift on the compareTime tab page

# Credits

Based on

- [grafana](https://github.com/grafana/grafana)
- [grafana-graph-panel](https://github.com/CorpGlory/grafana-graph-panel)
- [@types/grafana](https://github.com/CorpGlory/types-grafana)
- [grafana-multibar-graph-panel](https://github.com/CorpGlory/grafana-multibar-graph-panel)

Made by [AutoHome Team](https://github.com/AutohomeCorp)
