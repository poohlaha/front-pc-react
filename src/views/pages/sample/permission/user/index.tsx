/**
 * @fileOverview 用户管理
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'
import { useStore } from '@views/stores'
import RouterUrls from '@route/router.url.toml'
import { Pagination, Table, Tag } from 'antd'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'

const User = (): ReactElement => {
  const { userStore } = useStore()
  const [tableHeight, setTableHeight] = useState(0)

  useMount(async () => {
    setTableHeight(userStore.resize('user-page'))
    window.addEventListener('resize', () => setTableHeight(userStore.resize('user-page')))
    await userStore.getList(() => setTableHeight(userStore.resize('user-page')))
  })

  const COLUMNS: any = [
    {
      title: '账号',
      dataIndex: 'loginName',
      key: 'loginName',
      width: '10%'
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: '10%'
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: '10%'
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: '10%',
      render: (_: any, record: { [K: string]: any } = {}) => {
        if (Utils.isBlank(record.roleNames || '')) {
          return null
        }

        let roles = record.roleNames.split(',') || []
        if (roles.length === 0) {
          return null
        }

        let arr: React.ReactNode[] = []
        for (let role of roles) {
          if (Utils.isBlank(role || '')) continue
          arr.push(
            <Tag className="pt-1 pb-1 pl-2 pr-2 cursor-pointer" bordered={false} color="blue" key="role">
              {role || ''}
            </Tag>
          )
        }

        return arr
      }
    }
  ]

  const render = () => {
    const tableStyle: any = {}
    if (tableHeight > 0) {
      tableStyle.y = tableHeight ?? 0
    }

    return (
      <Page
        className="user-page wh100 overflow-hidden"
        loading={userStore.loading}
        contentClassName="flex-direction-column"
      >
        {/* title */}
        <div className="page-title flex-align-center pt-5 pl-5 pr-5">
          <p className="flex-1 font-bold text-xl">{RouterUrls.PERMISSION.USER.NAME || ''}</p>
        </div>

        {/* content */}
        <div className="page-content text-sm flex-1 flex-direction-column">
          {/* search */}
          <div className="page-search w100 p-5 flex-align-center"></div>

          {/* table */}
          <div className="page-wrapper w100 flex-1 flex-direction-column pl-5 pr-5">
            {/* table */}
            {tableStyle.y > 0 && (
              <Table
                className="m-ant-table flex-1"
                columns={COLUMNS}
                dataSource={userStore.list || []}
                pagination={false}
                scroll={tableStyle}
              />
            )}

            {/* pagination */}
            <div className="flex-jsc-end h-20 flex-align-center page-pagination">
              <Pagination
                className="m-ant-pagination"
                showSizeChanger
                total={userStore.total}
                current={userStore.currentPage}
                pageSize={userStore.pageSize}
                pageSizeOptions={userStore.pageSizeOptions}
                showTotal={total => `共 ${total} 条`}
                onChange={async (page: number, pageSize: number) => {
                  userStore.currentPage = userStore.pageSize !== pageSize ? 1 : page
                  userStore.pageSize = pageSize
                  await userStore.getList()
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

export default observer(User)
