var template = `
<div class="graph-panel" ng-class="{'graph-panel--legend-right': ctrl.panel.legend.rightSide}">
  <div class="graph-panel__chart" id="grafana-compare-graph" ng-dblclick="ctrl.zoomOut()">
  </div>

  <div class="graph-legend" id="graph-compare-legend"></div>
</div>
`

export default template
