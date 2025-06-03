/**
 * @fileOverview 角色管理
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'
import { useStore } from '@views/stores'
import RouterUrls from '@route/router.url.toml'
import { Pagination, Table, Tag } from 'antd'
import useMount from '@hooks/useMount'
import Utils from '@views/utils/utils'

const Role = (): ReactElement => {
  const { roleStore } = useStore()
  const [tableHeight, setTableHeight] = useState(0)

  useMount(async () => {
    setTableHeight(roleStore.resize('role-page'))
    window.addEventListener('resize', () => setTableHeight(roleStore.resize('role-page')))
    await roleStore.getList(() => setTableHeight(roleStore.resize('role-page')))
  })

  useEffect(() => {
    return () => {
      roleStore.onReset()
    }
  }, [])

  const COLUMNS: any = [
    {
      title: '角色ID',
      dataIndex: 'id',
      key: 'id',
      fixed: true,
      width: '10%'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: '10%'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (_: any, record: { [K: string]: any } = {}) => {
        let status =
          roleStore.STATUS_LIST.find((classify: { [K: string]: any } = {}) => classify.value === `${record.status}`) ||
          {}
        if (Utils.isObjectNull(status || {})) return null
        return (
          <Tag className="pt-1 pb-1 pl-2 pr-2 cursor-pointer" bordered={false} color={status.color || ''}>
            {status.label || ''}
          </Tag>
        )
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
        className="role-page wh100 overflow-hidden"
        loading={roleStore.loading}
        contentClassName="flex-direction-column"
        title={{
          label: RouterUrls.PERMISSION.USER.NAME || ''
        }}
      >
        {/* content */}
        <div className="page-content flex-1 flex-direction-column pt-5">
          {/* table */}
          <div className="page-wrapper w100 flex-1 flex-direction-column pl-5 pr-5">
            {/* table */}
            {tableStyle.y > 0 && (
              <Table
                className="m-ant-table flex-1"
                columns={COLUMNS}
                dataSource={roleStore.list || []}
                pagination={false}
                scroll={tableStyle}
              />
            )}

            {/* pagination */}
            <div className="flex-jsc-end h-20 flex-align-center page-pagination">
              <Pagination
                className="m-ant-pagination"
                showSizeChanger
                total={roleStore.total}
                current={roleStore.currentPage}
                pageSize={roleStore.pageSize}
                pageSizeOptions={roleStore.pageSizeOptions}
                showTotal={total => `共 ${total} 条`}
                onChange={async (page: number, pageSize: number) => {
                  roleStore.currentPage = roleStore.pageSize !== pageSize ? 1 : page
                  roleStore.pageSize = pageSize
                  await roleStore.getList()
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

export default observer(Role)
