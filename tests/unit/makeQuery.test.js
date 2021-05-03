/* eslint-disable */

import { createLocalVue, mount } from '@vue/test-utils'
import title from '@/components/segmentComponent/SegmentCreateTitle.vue'
import Vuex from "vuex"

// 테스트 레이블
import num_label from '@/json/label_by_criteria_num.json'
import str_label from '@/json/label_by_criteria_string.json'
import json_timestamp_label from '@/json/label_by_criteria_json_timestamp.json'

const localVue = createLocalVue()
localVue.directive('hoverText',  null)
localVue.use(Vuex)

const store = new Vuex.Store({
  state: {
    conditionLabels: [],
    segmentData: {idType: 'adid'}
  },
  getters: {
    getConditionLabels: (state) => {
      return state.conditionLabels
    },
    getSegmentData: (state) => {
      return state.segmentData
    }
  },
  mutations: {
    setConditionLabels(state, payload) {
      state.conditionLabels = payload
    }
  }
})

describe('number type query', () => {
  let label
  beforeEach(() => {
    label = [{and_boxes: [JSON.parse(JSON.stringify(num_label))]}]
  })

  it('값조건 >= 1 쿼리', async () => {
    label[0].and_boxes[0].gamecodes = ['mherosgb']        // 게임코드 : 마퓨파
    // label.aggr_alias = []
    label[0].and_boxes[0].aggr_boxes = []                 // 집계 조건 없음
    label[0].and_boxes[0].all_games = false               // 전체게임 선택 안함
    label[0].and_boxes[0].contain_closed_games = false    // 종료된 게임 포함 안함
    label[0].and_boxes[0].count = 1                       // 세그먼트 조건에 처음 사용된 레이블
    label[0].and_boxes[0].include_items = 0               // 포함 조건 : 포함
    label[0].and_boxes[0].job_date = "JOBDATE"            // 날짜 조건 : 마지막으로 집계된 날짜
    // label.json_filtered_keys = ""
    label[0].and_boxes[0].value_boxes = [{values: [{value: 1, value_sign: '>='}]}]
    store.commit('setConditionLabels', label)

    let res = common_code(num_label)

    // 조건에 따라 달라지는 부분
    expect(res.segmentLabelQueryMetas[0].startJobDate).toEqual('@JOBDATE-' + num_label.id)
    expect(res.segmentLabelQueryMetas[0].endJobDate).toBeNull()
    expect(res.segmentLabelQueryMetas[0].timestamp).toEqual('@TIMESTAMP-' + num_label.id)
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).toEqual('game_code')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).toEqual('game_code')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).toEqual(num_label.name + '_GAMECODE')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).toEqual('value')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).toEqual(num_label.name)
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).toEqual('>=')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).toEqual(1)
  })

  it('날짜 조건 최근3일, 집계 조건 sum >= 1 쿼리', async () => {
    label[0].and_boxes[0].gamecodes = ['mherosgb']        // 게임코드 : 마퓨파
    // label.aggr_alias = []
    label[0].and_boxes[0].aggr_boxes = [{values: [{aggregation: 'sum', value_sign: '>=', value: 1}]}]
    label[0].and_boxes[0].all_games = false               // 전체게임 선택 안함
    label[0].and_boxes[0].contain_closed_games = false    // 종료된 게임 포함 안함
    label[0].and_boxes[0].count = 1                       // 세그먼트 조건에 처음 사용된 레이블
    label[0].and_boxes[0].include_items = 0               // 포함 조건 : 포함
    label[0].and_boxes[0].job_date = "TODAY"            // 날짜 조건 : 최근 3일
    label[0].and_boxes[0].job_date_value = 3
    // label.json_filtered_keys = ""
    label[0].and_boxes[0].value_boxes = []
    store.commit('setConditionLabels', label)

    let res = common_code(num_label)

    // 조건에 따라 달라지는 부분
    expect(res.segmentLabelQueryMetas[0].startJobDate).toEqual('@TODAY-3')
    expect(res.segmentLabelQueryMetas[0].endJobDate).toEqual('@TODAY')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).toEqual('game_code')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).toEqual('game_code')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).toEqual(num_label.name + '_GAMECODE')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).toEqual('value')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].aggrOp).toEqual('sum')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).toEqual(num_label.name + "_sum")
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).toEqual('>=')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).toEqual(1)
  })
})

describe('string type query', () => {
  let label
  beforeEach(() => {
    label = [{and_boxes: [JSON.parse(JSON.stringify(str_label))]}]
  })

  it('값조건 = KR 쿼리', async () => {
    label[0].and_boxes[0].gamecodes = ['mherosgb']        // 게임코드 : 마퓨파
    // label.aggr_alias = []
    label[0].and_boxes[0].aggr_boxes = []                 // 집계 조건 없음
    label[0].and_boxes[0].all_games = false               // 전체게임 선택 안함
    label[0].and_boxes[0].contain_closed_games = false    // 종료된 게임 포함 안함
    label[0].and_boxes[0].count = 1                       // 세그먼트 조건에 처음 사용된 레이블
    label[0].and_boxes[0].include_items = 0               // 포함 조건 : 포함
    label[0].and_boxes[0].job_date = "JOBDATE"            // 날짜 조건 : 마지막으로 집계된 날짜
    // label.json_filtered_keys = ""
    label[0].and_boxes[0].value_boxes = [{values: [{value: "KR", value_sign: '='}]}]
    store.commit('setConditionLabels', label)

    let res = common_code(str_label)

    // 조건에 따라 달라지는 부분
    expect(res.segmentLabelQueryMetas[0].startJobDate).toEqual('@JOBDATE-' + str_label.id)
    expect(res.segmentLabelQueryMetas[0].endJobDate).toBeNull()
    expect(res.segmentLabelQueryMetas[0].timestamp).toEqual('@TIMESTAMP-' + str_label.id)
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).toEqual('game_code')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).toEqual('game_code')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).toEqual(str_label.name + '_GAMECODE')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).toEqual('value')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).toEqual(str_label.name)
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).toEqual('=')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).toEqual("KR")
  })

  it('날짜 조건 전체기간, 집계 조건 COUNT >= 2 쿼리', async () => {
    label[0].and_boxes[0].gamecodes = ['mherosgb']        // 게임코드 : 마퓨파
    // label.aggr_alias = []
    label[0].and_boxes[0].aggr_boxes = [{values: [{aggregation: 'COUNT', value_sign: '>=', value: 2}]}]
    label[0].and_boxes[0].all_games = false               // 전체게임 선택 안함
    label[0].and_boxes[0].contain_closed_games = false    // 종료된 게임 포함 안함
    label[0].and_boxes[0].count = 1                       // 세그먼트 조건에 처음 사용된 레이블
    label[0].and_boxes[0].include_items = 0               // 포함 조건 : 포함
    label[0].and_boxes[0].job_date = "NO_DATE"            // 날짜 조건 : 전체 기간
    // label.json_filtered_keys = ""
    label[0].and_boxes[0].value_boxes = []
    store.commit('setConditionLabels', label)

    let res = common_code(str_label)

    // 조건에 따라 달라지는 부분
    expect(res.segmentLabelQueryMetas[0].startJobDate).toBeNull()
    expect(res.segmentLabelQueryMetas[0].endJobDate).toBeNull()
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).toEqual('game_code')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).toEqual('game_code')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).toEqual(str_label.name + '_GAMECODE')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).toEqual('value')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].aggrOp).toEqual('COUNT')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).toEqual(str_label.name + "_COUNT")
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).toEqual('>=')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).toEqual(2)
  })
})

describe('json-timestamp type query', () => {
  let label
  beforeEach(() => {
    label = [{and_boxes: [JSON.parse(JSON.stringify(json_timestamp_label))]}]
  })

  it('날짜조건 특정기간, 값조건 mherosgb <= 날짜 쿼리', async () => {
    label[0].and_boxes[0].gamecodes = ['mherosgb']        // 게임코드 : 마퓨파
    // label.aggr_alias = []
    label[0].and_boxes[0].aggr_boxes = []                 // 집계 조건 없음
    label[0].and_boxes[0].all_games = false               // 전체게임 선택 안함
    label[0].and_boxes[0].contain_closed_games = false    // 종료된 게임 포함 안함
    label[0].and_boxes[0].count = 1                       // 세그먼트 조건에 처음 사용된 레이블
    label[0].and_boxes[0].include_items = 0               // 포함 조건 : 포함
    label[0].and_boxes[0].job_date = "RANGE"            // 날짜 조건 : 전체 기간
    label[0].and_boxes[0].job_date_value3 = "2021-04-20"
    label[0].and_boxes[0].job_date_value4 = "2021-04-21"
    // label.json_filtered_keys = ""
    label[0].and_boxes[0].value_boxes = [{values: [{key: "mherosgb", value: "2021-04-29", value_time: "00:00", value_sign: '<='}]}]
    store.commit('setConditionLabels', label)

    let res = common_code(json_timestamp_label)

    // 조건에 따라 달라지는 부분
    expect(res.segmentLabelQueryMetas[0].startJobDate).toEqual("2021-04-20")
    expect(res.segmentLabelQueryMetas[0].endJobDate).toEqual("2021-04-21")
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).toEqual('game_code')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).toEqual('game_code')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).toEqual(json_timestamp_label.name + '_GAMECODE')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).toEqual('value, $.mherosgb')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).toEqual(json_timestamp_label.name + '_0')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).toEqual('<=')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).toEqual(1619622000000)
  })

  it('날짜 조건 마지막으로 집계된 날짜, 집계 조건 COUNT >= 2 쿼리', async () => {
    label[0].and_boxes[0].gamecodes = ['mherosgb']        // 게임코드 : 마퓨파
    // label.aggr_alias = []
    label[0].and_boxes[0].aggr_boxes = [{values: [{aggregation: 'COUNT', value_sign: '>=', value: 2}]}]
    label[0].and_boxes[0].all_games = false               // 전체게임 선택 안함
    label[0].and_boxes[0].contain_closed_games = false    // 종료된 게임 포함 안함
    label[0].and_boxes[0].count = 1                       // 세그먼트 조건에 처음 사용된 레이블
    label[0].and_boxes[0].include_items = 0               // 포함 조건 : 포함
    label[0].and_boxes[0].job_date = "JOBDATE"            // 날짜 조건 : 마지막으로 집계된 날짜
    // label.json_filtered_keys = ""
    label[0].and_boxes[0].value_boxes = []
    store.commit('setConditionLabels', label)

    let res = common_code(json_timestamp_label)

    // 조건에 따라 달라지는 부분
    expect(res.segmentLabelQueryMetas[0].startJobDate).toEqual('@JOBDATE-' + json_timestamp_label.id)
    expect(res.segmentLabelQueryMetas[0].endJobDate).toBeNull()
    expect(res.segmentLabelQueryMetas[0].timestamp).toEqual('@TIMESTAMP-' + json_timestamp_label.id)
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).toEqual('id')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).toEqual('game_code')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).toEqual('game_code')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).toEqual(json_timestamp_label.name + '_GAMECODE')

    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).toEqual('value')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].aggrOp).toEqual('COUNT')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).toEqual(json_timestamp_label.name + "_COUNT")
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).toEqual('>=')
    expect(res.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).toEqual(2)
  })
})




function common_code(arg_label) {
  const wrapper = mount(title, {store, localVue, stubs: ['SegmentJobDefinitionExecuteRedirect', 'Approx'], directives: {hoverText: null}})

  let query = {
    idType: 'adid',
    labelRelation: '',
    segmentLabelQueryMetas: [],
    joinColumns: [],
    additionConditions: ["addition IS NULL OR addition != 'deleted'"]
  }
  let res = wrapper.vm.makeQuery(query, "create")
  // console.log(res)
  // 조건 관계 없이 같은 부분
  expect(res.additionConditions).toEqual(["addition IS NULL OR addition != 'deleted'"])
  expect(res.labelRelation).toEqual('(' + arg_label.gbq_table_name + '#1)')
  expect(res.joinColumns).toEqual(['id'])
  expect(res.miConditions).toEqual([])
  expect(res.segmentLabelQueryMetas[0].label).toEqual(arg_label.name)
  expect(res.segmentLabelQueryMetas[0].labelId).toEqual(arg_label.id)
  expect(res.segmentLabelQueryMetas[0].gameCodes).toEqual(['mherosgb'])
  expect(res.segmentLabelQueryMetas[0].useAllGames).toEqual(false)
  expect(res.segmentLabelQueryMetas[0].useClosedGames).toEqual(false)
  expect(res.segmentLabelQueryMetas[0].dataType).toEqual(arg_label.data_type)
  return res
}
