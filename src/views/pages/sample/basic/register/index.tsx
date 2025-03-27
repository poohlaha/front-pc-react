/**
 * @fileOverview 注册用户
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'
import { useStore } from '@views/stores'
import RouterUrls from '@route/router.url.toml'
import { Pagination, Table, DatePicker, Button, Input } from 'antd'
import useMount from '@hooks/useMount'
import dayjs from 'dayjs'
import Utils from '@views/utils/utils'

const Register = (): ReactElement => {
  const { registerStore } = useStore()
  const [tableHeight, setTableHeight] = useState(0)

  useMount(async () => {
    setTableHeight(registerStore.resize('register-page'))
    window.addEventListener('resize', () => setTableHeight(registerStore.resize('register-page')))
    await registerStore.getList(() => setTableHeight(registerStore.resize('register-page')))
  })

  useEffect(() => {
    return () => {
      registerStore.onReset()
    }
  }, [])

  const COLUMNS: any = [
    {
      title: 'id',
      dataIndex: 'key',
      key: 'key',
      width: '10%'
    },
    {
      title: '手机号码',
      dataIndex: 'account',
      key: 'account',
      width: '20%'
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: '30%'
    }
  ]

  const getDateValues = () => {
    let dates: any = []
    if (!Utils.isBlank(registerStore.searchForm.startTime || '')) {
      dates.push(dayjs(registerStore.searchForm.startTime))
    }

    if (!Utils.isBlank(registerStore.searchForm.endTime || '')) {
      dates.push(dayjs(registerStore.searchForm.endTime))
    }

    return dates
  }

  const render = () => {
    const tableStyle: any = {}
    if (tableHeight > 0) {
      tableStyle.y = tableHeight ?? 0
    }

    return (
      <Page
        className="register-page wh100 overflow-hidden"
        loading={registerStore.loading}
        contentClassName="flex-direction-column"
      >
        {/* title */}
        <div className="page-title flex-align-center pt-5 pl-5 pr-5">
          <p className="flex-1 font-bold text-xl">{RouterUrls.BASIC_DATA.REGISTER.NAME || ''}</p>
        </div>

        {/* content */}
        <div className="page-content text-sm flex-1 flex-direction-column">
          {/* search */}
          <div className="page-search w100 p-5 flex-align-center">
            {/* 手机号码 */}
            <div className="search-item flex-align-center mr-3">
              <p className="search-item-text mr-2">手机号码</p>
              <Input
                placeholder="请输入"
                value={registerStore.searchForm.account || ''}
                allowClear
                className="m-ant-input !w-44"
                onChange={e => {
                  registerStore.searchForm.account = e.target.value || ''
                }}
              />
            </div>

            {/* 注册时间 */}
            <div className="search-item flex-align-center mr-3">
              <p className="search-item-text mr-2">注册时间</p>
              <DatePicker.RangePicker
                showTime={false}
                popupClassName="m-ant-picker-dropdown"
                rootClassName="m-ant-picker-range"
                format={registerStore.DATE_FORMAT}
                value={getDateValues()}
                onChange={(_, dates) => {
                  registerStore.searchForm.startTime = dates[0] || ''
                  registerStore.searchForm.endTime = dates[1] || ''
                }}
              />
            </div>

            {/* 按钮 */}
            <div className="search-item flex-align-center">
              <Button type="primary" className="mr-3 m-ant-button" onClick={async () => await registerStore.getList()}>
                搜 索
              </Button>
              <Button
                type="default"
                className="m-ant-button"
                onClick={async () => {
                  registerStore.searchForm = Utils.deepCopy(registerStore.DEFAULT_SEARCH_FORM)
                  registerStore.searchForm.startTime = ''
                  registerStore.searchForm.endTime = ''
                  registerStore.currentPage = 1
                  registerStore.pageSize = registerStore.DEFAULT_PAGE_SIZE
                  await registerStore.getList()
                }}
              >
                重 置
              </Button>
            </div>
          </div>

          {/* table */}
          <div className="page-wrapper w100 flex-1 flex-direction-column pl-5 pr-5">
            {/* table */}
            {tableStyle.y > 0 && (
              <Table
                className="m-ant-table flex-1"
                columns={COLUMNS}
                dataSource={registerStore.list || []}
                pagination={false}
                scroll={tableStyle}
              />
            )}

            {/* pagination */}
            <div className="flex-jsc-end h-20 flex-align-center page-pagination">
              <Pagination
                className="m-ant-pagination"
                showSizeChanger
                total={registerStore.total}
                current={registerStore.currentPage}
                pageSize={registerStore.pageSize}
                pageSizeOptions={registerStore.pageSizeOptions}
                showTotal={total => `共 ${total} 条`}
                onChange={async (page: number, pageSize: number) => {
                  registerStore.currentPage = registerStore.pageSize !== pageSize ? 1 : page
                  registerStore.pageSize = pageSize
                  await registerStore.getList()
                }}
              />
            </div>
          </div>
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(Register)
