/**
 * @fileOverview Page
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { PropsWithChildren, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Loading from '../../components/loading/loading'

interface IPageProps {
  className?: string
  contentClassName?: string
  loading?: boolean
}

const Page = (props: PropsWithChildren<IPageProps>): ReactElement => {
  const render = () => {
    return (
      <div className={`wh100 ${props.className || ''}`}>
        <div className={`${props.contentClassName || ''} wh100 md:pt-0`}>{props.children}</div>

        {/* loading */}
        <Loading show={props.loading ?? false} />
      </div>
    )
  }

  return render()
}

export default observer(Page)
