/**
 * @fileOverview Indexed DB
 * @date 2025-03-10
 * @author poohlaha
 */
import { openDB, deleteDB } from 'idb'
import Utils from '@views/utils/utils'

export default class DB {
  private db: any = null
  private dbName: string = ''

  /**
   * 创建
   * @param dbName
   * @param dbVersion
   */
  async create(dbName: string = '', dbVersion?: number) {
    if (Utils.isBlank(dbName || '')) return null
    this.dbName = dbName || ''
    const version = dbVersion ?? 1
    this.db = await openDB(dbName, version, {
      upgrade(database: any) {
        if (!database.objectStoreNames.contains(dbName)) {
          database.createObjectStore(dbName, { keyPath: 'id', autoIncrement: false })
          console.log(`Created name: ${dbName || ''} version: ${dbVersion} Success !`)
        }
      }
    })
  }

  /**
   * 插入
   */
  async insert(data: { id: string; [K: string]: any }) {
    if (!this.db) {
      console.error('Please Create Database First !')
      return false
    }

    if (Utils.isBlank(data.id || '')) {
      console.error('Insert To Database Error, id is null !')
      return false
    }

    try {
      await this.db.put(this.dbName || '', data)
      return true
    } catch (e) {
      console.error('Insert To Database Error: ', e)
      return false
    }
  }

  /**
   * 查找
   */
  async get(id: string) {
    if (Utils.isBlank(id || '')) return null
    if (!this.db) {
      console.error('Please Create Database First !')
      return false
    }

    if (Utils.isBlank(id || '')) {
      console.error('Get Database Data Error, id is null !')
      return null
    }

    try {
      return await this.db.get(this.dbName, id)
    } catch (e) {
      console.error(`Get ${id} Error: `, e)
      return null
    }
  }

  /**
   * 修改
   */
  async update(data: { id: string; [K: string]: any }) {
    return await this.insert(data)
  }

  /**
   * 删除
   */
  async delete(id: string) {
    if (!this.db) {
      console.error('Please Create Database First !')
      return false
    }

    if (Utils.isBlank(id || '')) {
      console.error('Delete Database Data Error, id is null !')
      return null
    }

    try {
      return await this.db.delete(this.dbName, id)
    } catch (e) {
      console.error(`Delete ${id} Data Error: `, e)
      return null
    }
  }

  /**
   * 清空所有数据
   */
  async clear() {
    if (!this.db) {
      console.error('Please Create Database First !')
      return false
    }

    try {
      return await this.db.clear(this.dbName)
      // eslint-disable-next-line no-unreachable
      const str = `Cleared ${this.dbName} All Data.`
      console.log(str)
    } catch (e) {
      console.error(`Clear ${this.dbName} All Data Error: `, e)
      return null
    }
  }

  /**
   * 删除整个数据库
   */
  async deleteDB() {
    if (!this.db) {
      console.error('Please Create Database First !')
      return false
    }

    try {
      await deleteDB(this.dbName)
      console.log(`Deleted Database: ${this.dbName} .`)
      return true
    } catch (e) {
      console.error(`Delete Database: ${this.dbName} Error: `, e)
      return false
    }
  }

  getDb() {
    return this.db
  }
}
