import './graph'
import './series_overrides_ctrl'
import './thresholds_form'
import './time_regions_form'

import template from './template'
import _ from 'lodash'
import config from 'grafana/app/core/config'
import { MetricsPanelCtrl, alertTab } from 'grafana/app/plugins/sdk'
import { DataProcessor } from './data_processor'
import { axesEditorComponent } from './axes_editor'
import * as timeShiftUtil from './time_shift_util'
class GraphCtrl extends MetricsPanelCtrl {
  static template = template

  renderError: boolean
  hiddenSeries: any = {}
  seriesList: any = []
  dataList: any = []
  annotations: any = []
  alertState: any
  _panelPath: any
  annotationsPromise: any
  dataWarning: any
  colors: any = []
  subTabIndex: number
  processor: DataProcessor
  timeShifts_sort: number
  range_bak: any
  timeInfo_bak: any
  queryTimeShifts: any = []
  snapshot_tmp: any
  panelDefaults = {
    // datasource name, null = default datasource
    datasource: null,
    // sets client side (flot) or native graphite png renderer (png)
    renderer: 'flot',
    yaxes: [
      {
        label: null,
        show: true,
        logBase: 1,
        min: null,
        max: null,
        format: 'short'
      },
      {
        label: null,
        show: true,
        logBase: 1,
        min: null,
        max: null,
        format: 'short'
      }
    ],
    xaxis: {
      show: true,
      mode: 'time',
      name: null,
      values: [],
      buckets: null
    },
    yaxis: {
      align: false,
      alignLevel: null
    },
    // show/hide lines
    lines: true,
    // fill factor
    fill: 1,
    // line width in pixels
    linewidth: 1,
    // show/hide dashed line
    dashes: false,
    // length of a dash
    dashLength: 10,
    // length of space between two dashes
    spaceLength: 10,
    // show hide points
    points: false,
    // point radius in pixels
    pointradius: 5,
    // show hide bars
    bars: false,
    // enable/disable stacking
    stack: false,
    // stack percentage mode
    percentage: false,
    // legend options
    legend: {
      show: true, // disable/enable legend
      values: false, // disable/enable legend values
      min: false,
      max: false,
      current: false,
      total: false,
      avg: false
    },
    // how null points should be handled
    nullPointMode: 'null',
    // staircase line mode
    steppedLine: false,
    // tooltip options
    tooltip: {
      value_type: 'individual',
      shared: true,
      sort: 0
    },
    // time overrides
    timeFrom: null,
    timeShift: null,
    // metric queries
    targets: [{}],
    // series color overrides
    aliasColors: {},
    // other style overrides
    seriesOverrides: [],
    thresholds: [],
    timeRegions: [],
    timeShifts: []
  }

  /** @ngInject */
  constructor($scope, $injector, private annotationsSrv) {
    super($scope, $injector)

    _.defaults(this.panel, this.panelDefaults)
    _.defaults(this.panel.tooltip, this.panelDefaults.tooltip)
    _.defaults(this.panel.legend, this.panelDefaults.legend)
    _.defaults(this.panel.xaxis, this.panelDefaults.xaxis)

    this.processor = new DataProcessor(this.panel)

    this.events.on('render', this.onRender.bind(this))
    this.events.on('data-received', this.onDataReceived.bind(this))
    this.events.on('data-error', this.onDataError.bind(this))
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this))
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this))
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this))
  }

  onInitEditMode() {
    var partialPath = this.panelPath
    this.addEditorTab('Axes', axesEditorComponent, 2)
    this.addEditorTab('Legend', `${partialPath}/tab_legend.html`, 3)
    this.addEditorTab('Display', `${partialPath}/tab_display.html`, 4)
    this.addEditorTab('CompareTime', `${partialPath}/tab_compare_time.html`, 5)
    if (config.alertingEnabled) {
      this.addEditorTab('Alert', alertTab, 6)
    }
    this.log(
      'editorTabs+++++++++++panel.editorTabs:' +
        JSON.stringify(this.editorTabs) +
        '+++'
    )
    let timeRangeIndex = -1
    for (let index = 0; index < this.editorTabs.length; index++) {
      let tab = this.editorTabs[index]
      if (typeof tab != 'undefined' && tab.title == 'Time range') {
        timeRangeIndex = index
        break
      }
    }
    if (timeRangeIndex > -1) {
      this.editorTabs.splice(timeRangeIndex, 1)
    }
    this.subTabIndex = 0
  }

  onInitPanelActions(actions) {
    actions.push({ text: 'Export CSV', click: 'ctrl.exportCsv()' })
    actions.push({
      text: 'Toggle legend',
      click: 'ctrl.toggleLegend()',
      shortcut: 'p l'
    })
  }

  issueQueries(datasource) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range
    })

    /* Wait for annotationSrv requests to get datasources to
     * resolve before issuing queries. This allows the annotations
     * service to fire annotations queries before graph queries
     * (but not wait for completion). This resolves
     * issue 11806.
     */
    return this.annotationsSrv.datasourcePromises.then(r => {
      return super.issueQueries(datasource)
    })
  }

  zoomOut(evt) {
    this.publishAppEvent('zoom-out', 2)
  }

  onDataSnapshotLoad(snapshotData) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range
    })
    this.dataReceived(snapshotData)
  }

  onDataError(err) {
    this.timeShifts_sort = 0
    this.seriesList = []
    this.annotations = []
    this.render([])
  }
  emitTimeShiftRefresh() {
    let timeShift = this.panel.timeShifts[this.timeShifts_sort - 1]
    this.log(
      'emitRefresh+++++++++++timeShift:' +
        JSON.stringify(timeShift) +
        '++timeShifts_sort:' +
        this.timeShifts_sort +
        '++++++++timeShift.value:' +
        timeShift.value
    )
    this.panel.timeShift = timeShift.value

    this.events.emit('refresh')
  }
  gennerDataListTimeShift(dataList, timeShift) {
    if (
      dataList.length == 0 ||
      dataList[0].type ||
      dataList[0].type == 'table' ||
      typeof timeShift == 'undefined' ||
      typeof timeShift.value == 'undefined' ||
      timeShift.value == null ||
      timeShift.value == ''
    ) {
      return dataList
    }
    this.log('gennerDataListTimeShift+from' + JSON.stringify(this.range.from))
    //let timeShift_ms = timeShiftUtil.parseShiftToMs(timeShift.value);
    let timeShift_ms = timeShiftUtil.parseShiftToMs(
      this.range.from,
      timeShift.value
    )

    if (typeof timeShift_ms == 'undefined') {
      return []
    }
    this.log(
      'gennerDataListTimeShift: timeShift=' +
        JSON.stringify(timeShift) +
        '======;timeShift_ms=' +
        timeShift_ms
    )
    for (let line of dataList) {
      if (
        typeof timeShift.alias == 'undefined' ||
        timeShift.alias == null ||
        timeShift.alias == ''
      ) {
        line.target = line.target + '_' + timeShift.value
      } else {
        line.target = line.target + '_' + timeShift.alias
      }
      for (let point of line.datapoints) {
        point[1] = point[1] + timeShift_ms
      }
    }
    return dataList
  }
  needEmitTimeShift() {
    this.log(
      'this.timeShifts_sort :' +
        this.timeShifts_sort +
        ',this.panel.timeShifts.length:' +
        this.panel.timeShifts.length
    )
    if (this.panel.timeShifts.length < this.timeShifts_sort) {
      return false
    }

    this.timeShifts_sort++
    let timeShift = this.panel.timeShifts[this.timeShifts_sort - 1]
    if (
      typeof timeShift !== 'undefined' &&
      typeof timeShift.value !== 'undefined' &&
      timeShift.value != null &&
      timeShift.value != ''
    ) {
      return true
    } else {
      return this.needEmitTimeShift()
    }
  }
  onDataReceived(dataList) {
    this.log(
      'this.timeShifts_sort :' +
        this.timeShifts_sort +
        ',this.panel.timeShifts.length:' +
        this.panel.timeShifts.length
    )
    this.log(
      'this.panel.snapshotData:' + JSON.stringify(this.panel.snapshotData)
    )
    if (this.dashboard.snapshot) {
      this.snapshot_tmp = this.dashboard.snapshot
      this.dashboard.snapshot = undefined
      this.panel.snapshotData = undefined
    }

    if (
      this.timeShifts_sort == 0 ||
      typeof this.timeShifts_sort == 'undefined'
    ) {
      this.timeShifts_sort = 0
      this.dataList = dataList
      this.range_bak = this.range
      this.timeInfo_bak = this.timeInfo
      this.log('+++++++++++++ssssssss+++++++++++++')
    } else {
      dataList = this.gennerDataListTimeShift(
        dataList,
        this.panel.timeShifts[this.timeShifts_sort - 1]
      )
      this.dataList.push(...dataList)
    }

    if (this.needEmitTimeShift()) {
      this.emitTimeShiftRefresh()
      return
    }
    this.revert()
    //this.log('final:' + JSON.stringify(this.dataList))
    this.log('final')
    this.dataReceived(this.dataList)
  }
  revert() {
    this.range = this.range_bak
    this.timeInfo = this.timeInfo_bak
    this.panel.timeShift = ''
    this.timeShifts_sort = 0
  }
  dataReceived(dataList) {
    this.log('this.snapshot_tmp:' + JSON.stringify(this.snapshot_tmp))
    if (this.snapshot_tmp) {
      this.panel.snapshotData = dataList
      this.dashboard.snapshot = this.snapshot_tmp
      this.snapshot_tmp = undefined
    }

    this.seriesList = this.processor.getSeriesList({
      dataList: dataList,
      range: this.range
    })

    this.dataWarning = null
    const datapointsCount = this.seriesList.reduce((prev, series) => {
      return prev + series.datapoints.length
    }, 0)

    if (datapointsCount === 0) {
      this.dataWarning = {
        title: 'No data points',
        tip: 'No datapoints returned from data query'
      }
    } else {
      for (const series of this.seriesList) {
        if (series.isOutsideRange) {
          this.dataWarning = {
            title: 'Data points outside time range',
            tip:
              'Can be caused by timezone mismatch or missing time filter in query'
          }
          break
        }
      }
    }

    this.annotationsPromise.then(
      result => {
        this.loading = false
        this.alertState = result.alertState
        this.annotations = result.annotations
        this.render(this.seriesList)
      },
      () => {
        this.loading = false
        this.render(this.seriesList)
      }
    )
  }
  onRender() {
    if (!this.seriesList) {
      return
    }

    for (const series of this.seriesList) {
      series.applySeriesOverrides(this.panel.seriesOverrides)

      if (series.unit) {
        this.panel.yaxes[series.yaxis - 1].format = series.unit
      }
    }
  }

  onColorChange = (series, color) => {
    series.setColor(color)
    this.panel.aliasColors[series.alias] = series.color
    this.render()
  }

  onToggleSeries = hiddenSeries => {
    this.hiddenSeries = hiddenSeries
    this.render()
  }

  onToggleSort = (sortBy, sortDesc) => {
    this.panel.legend.sort = sortBy
    this.panel.legend.sortDesc = sortDesc
    this.render()
  }

  onToggleAxis = info => {
    let override = _.find(this.panel.seriesOverrides, { alias: info.alias })
    if (!override) {
      override = { alias: info.alias }
      this.panel.seriesOverrides.push(override)
    }
    override.yaxis = info.yaxis
    this.render()
  }

  addSeriesOverride(override) {
    this.panel.seriesOverrides.push(override || {})
  }

  removeSeriesOverride(override) {
    this.panel.seriesOverrides = _.without(this.panel.seriesOverrides, override)
    this.render()
  }

  toggleLegend() {
    this.panel.legend.show = !this.panel.legend.show
    this.refresh()
  }

  legendValuesOptionChanged() {
    const legend = this.panel.legend
    legend.values =
      legend.min || legend.max || legend.avg || legend.current || legend.total
    this.render()
  }

  exportCsv() {
    const scope = this.$scope.$new(true)
    scope.seriesList = this.seriesList
    this.publishAppEvent('show-modal', {
      templateHtml: '<export-data-modal data="seriesList"></export-data-modal>',
      scope,
      modalClass: 'modal--narrow'
    })
  }
  addTimeShifts() {
    let id = this.getTimeShiftId()
    this.log('addTimeShifts++++++++++id:' + id)
    this.panel.timeShifts.push({ id: id })
  }
  removeTimeShift(timeShift) {
    this.log('removeTimeShift++++++++++:' + JSON.stringify(timeShift))
    var index = _.indexOf(this.panel.timeShifts, timeShift)
    this.log('removeTimeShift++++++++++index:' + index)
    this.panel.timeShifts.splice(index, 1)
    this.refreshTimeShifts()
  }
  refreshTimeShifts() {
    this.log('refreshTimeShifts:' + JSON.stringify(this.panel.timeShifts))
    this.refresh()
  }
  getTimeShiftId() {
    let id = 0
    while (true) {
      let notExits = _.every(this.panel.timeShifts, function(timeShift) {
        return timeShift.id !== id
      })
      if (notExits) {
        return id
      } else {
        id++
      }
    }
  }
  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = 'public/plugins/' + this.pluginId + '/'
    }
    return this._panelPath
  }
  log(msg) {
    if (false) {
      console.log(msg)
    }
  }
}

export { GraphCtrl, GraphCtrl as PanelCtrl }
