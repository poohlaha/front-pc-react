/**
 * @fileOverview Page
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { PropsWithChildren, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Loading from '../../components/loading/loading'
import { useStore } from '@views/stores'
import { useNavigate } from 'react-router-dom'
import Utils from '@views/utils/utils'
import ReactDOM from 'react-dom'

interface IPageTitleProps {
  show?: boolean
  needBack?: boolean
  label?: string
  right?: React.ReactNode
  backUrl?: string
}

interface IPageProps {
  className?: string
  contentClassName?: string
  loading?: boolean
  breadCrumbItemList?: Array<{ [K: string]: any }> // 面包屑列表
  title?: IPageTitleProps
}

const Page = (props: PropsWithChildren<IPageProps>): ReactElement => {
  const { commonStore } = useStore()

  const navigate = useNavigate()

  const render = () => {
    let title = props.title || {}
    const hasTitle = title.show ?? true
    const needBack = title.needBack ?? false
    return (
      <div className={`wh100 ${props.className || ''}`}>
        <div className={`${props.contentClassName || ''} wh100 pl-6 pr-6`}>
          {hasTitle && (
            <div className="page-title flex-align-center mb-4 color pt-6">
              {needBack && (
                <span
                  className="iconfont color text-base !font-bold icon-fanhui flex-center cursor-pointer"
                  onClick={() => {
                    if (Utils.isBlank(title.backUrl || '')) {
                      return
                    }

                    navigate(title.backUrl || '')
                  }}
                ></span>
              )}
              <p className={`flex-1 font-bold ${commonStore.font.titleFontSize || ''} ${needBack ? 'ml-2' : ''}`}>
                {title.label || ''}
              </p>
              {title.right}
            </div>
          )}

          {/* content */}
          {props.children}
        </div>

        {/* loading */}
        {ReactDOM.createPortal(<Loading className="pl-64" show={props.loading ?? false} />, document.body)}
      </div>
    )
  }

  return render()
}

export default observer(Page)
