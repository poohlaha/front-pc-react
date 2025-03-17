/**
 * @fileOverview 基础数据维护 store
 * @date 2023-04-12
 * @author poohlaha
 */
import BaseStore from '@stores/base/base.store'

export default class BasicStore extends BaseStore {
  // 级别
  readonly LEVEL_LIST: Array<{ [K: string]: any }> = [
    {
      value: '1',
      label: '一级拦截',
      color: 'orange'
    },
    {
      value: '2',
      label: '二级拦截',
      color: 'volcano'
    },
    {
      value: '3',
      label: '三级拦截',
      color: 'magenta'
    }
  ]

  // 分类
  readonly CLASSIFY_LIST: Array<{ [K: string]: any }> = [
    {
      value: '1',
      label: '政治敏感',
      level: this.LEVEL_LIST[0],
      color: 'red'
    },
    {
      value: '2',
      label: '违禁物品',
      level: this.LEVEL_LIST[0],
      color: 'magenta'
    },
    {
      value: '3',
      label: '暴力恐怖',
      level: this.LEVEL_LIST[1],
      color: 'orange'
    },
    {
      value: '4',
      label: '色情低俗',
      level: this.LEVEL_LIST[1],
      color: 'gold'
    },
    {
      value: '5',
      label: '商业违法',
      level: this.LEVEL_LIST[1],
      color: 'lime'
    },
    {
      value: '6',
      label: '侵犯隐私',
      level: this.LEVEL_LIST[1],
      color: 'blue'
    },
    {
      value: '7',
      label: '侮辱诽谤',
      level: this.LEVEL_LIST[1],
      color: 'purple'
    },
    {
      value: '8',
      label: '宗教迷信',
      level: this.LEVEL_LIST[1],
      color: 'volcano'
    },
    {
      value: '9',
      label: '广告诈骗',
      level: this.LEVEL_LIST[2],
      color: 'cyan'
    },
    {
      value: '10',
      label: '虚假信息',
      level: this.LEVEL_LIST[2],
      color: 'gold'
    }
  ]
}
