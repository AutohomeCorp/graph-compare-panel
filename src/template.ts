var template = `
<div class="graph-panel" ng-class="{'graph-panel--legend-right': ctrl.panel.legend.rightSide}">
  <div class="graph-panel__chart" grafana-compare-graph ng-dblclick="ctrl.zoomOut()">
  </div>

  <div class="graph-legend" graph-compare-legend></div>
</div>
`;

export default template;
