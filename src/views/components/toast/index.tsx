/**
 * @fileOverview TODO
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom/client'

interface IMToastProps extends IToastProps {
  duration?: number // 时间 0 为不关闭
  onClose?: () => void
}

interface IToastProps {
  className?: string
  text: string
  svg?: React.ReactNode
  type?: number
}

const Toast = (props: IToastProps): ReactElement => {
  const getSuccessSvg = () => {
    return (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="m-toast-icon w-12 h-12 text-white mb-2">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
            <rect fill="#FFFFFF" opacity="0" x="0" y="0" width="48" height="48"></rect>
            <path
              d="M44.309608,12.6841286 L21.2180499,35.5661955 L21.2180499,35.5661955 C20.6343343,36.1446015 19.6879443,36.1446015 19.1042286,35.5661955 C19.0538201,35.5162456 19.0077648,35.4636155 18.9660627,35.4087682 C18.9113105,35.368106 18.8584669,35.3226694 18.808302,35.2729607 L3.6903839,20.2920499 C3.53346476,20.1365529 3.53231192,19.8832895 3.68780898,19.7263704 C3.7629255,19.6505669 3.86521855,19.6079227 3.97193622,19.6079227 L7.06238923,19.6079227 C7.16784214,19.6079227 7.26902895,19.6495648 7.34393561,19.7237896 L20.160443,32.4236157 L20.160443,32.4236157 L40.656066,12.115858 C40.7309719,12.0416387 40.8321549,12 40.9376034,12 L44.0280571,12 C44.248971,12 44.4280571,12.1790861 44.4280571,12.4 C44.4280571,12.5067183 44.3854124,12.609012 44.309608,12.6841286 Z"
              fill="currentColor"
              fillRule="nonzero"
            />
          </g>
        </g>
      </svg>
    )
  }

  const getWarningSvg = () => {
    return (
      <svg
        className="m-toast-icon w-12 h-12 text-white mb-2"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M512 820m-44 0a44 44 0 1 0 88 0 44 44 0 1 0-88 0Z" fill="currentColor"></path>
        <path
          d="M512 712c-19.8 0-36-16.2-36-36V196c0-19.8 16.2-36 36-36s36 16.2 36 36v480c0 19.8-16.2 36-36 36z"
          fill="currentColor"
          fillRule="nonzero"
        ></path>
      </svg>
    )
  }

  const getErrorSvg = () => {
    return (
      <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="m-toast-icon w-12 h-12 text-white mb-2">
        <g id="CloseOutline-CloseOutline" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="CloseOutline-编组">
            <rect fill="#FFFFFF" opacity="0" x="0" y="0" width="48" height="48"></rect>
            <path
              d="M10.6085104,8.11754663 L24.1768397,21.8195031 L24.1768397,21.8195031 L37.7443031,8.1175556 C37.8194278,8.04168616 37.9217669,7.999 38.0285372,7.999 L41.1040268,7.999 C41.3249407,7.999 41.5040268,8.1780861 41.5040268,8.399 C41.5040268,8.50440471 41.4624226,8.60554929 41.3882578,8.68044752 L26.2773302,23.9408235 L26.2773302,23.9408235 L41.5021975,39.3175645 C41.65763,39.4745475 41.6563731,39.7278104 41.4993901,39.8832429 C41.4244929,39.9574004 41.3233534,39.999 41.2179546,39.999 L38.1434012,39.999 C38.0366291,39.999 37.9342885,39.9563124 37.8591634,39.8804408 L24.1768397,26.0621438 L24.1768397,26.0621438 L10.4936501,39.8804497 C10.4185257,39.9563159 10.3161889,39.999 10.2094212,39.999 L7.13584526,39.999 C6.91493136,39.999 6.73584526,39.8199139 6.73584526,39.599 C6.73584526,39.4936017 6.77744443,39.3924627 6.85160121,39.3175656 L22.0763492,23.9408235 L22.0763492,23.9408235 L6.96554081,8.68044639 C6.81010226,8.52346929 6.81134951,8.27020637 6.9683266,8.11476782 C7.04322474,8.04060377 7.14436883,7.999 7.24977299,7.999 L10.3242852,7.999 C10.4310511,7.999 10.5333863,8.04168267 10.6085104,8.11754663 Z"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
          </g>
        </g>
      </svg>
    )
  }

  const getIcon = () => {
    if (props.svg) {
      return props.svg
    }

    let iconType = props.type ?? 0
    if (iconType < 1 || iconType > 4) {
      iconType = 1
    }

    // info
    if (iconType === 1) {
      return null
    }

    // success
    if (iconType === 2) {
      return getSuccessSvg()
    }

    // success
    if (iconType === 3) {
      return getWarningSvg()
    }

    // error
    if (iconType === 4) {
      return getErrorSvg()
    }

    return null
  }

  return (
    <div className={`m-toast position-relative ${props.className || ''}`}>
      <div className="m-toast-mask wh100 top-0 bottom-0 position-fixed"></div>
      <div className="m-toast-content position-fixed flex-center wh100 top-12 bottom-0">
        <div className="m-toast-content-wrapper flex-direction-column flex-center p-5 rounded-lg">
          {getIcon()}
          <div className="m-toast-content-inner text-white text-sm">{props.text || ''}</div>
        </div>
      </div>
    </div>
  )
}

Toast.defaultProps = {
  className: '',
  svg: null,
  type: 0
}

const createToast = (props: IMToastProps, type: number = 0) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const root = ReactDOM.createRoot(div)

  const removeToast = () => {
    root.unmount()
    document.body.removeChild(div)
    props.onClose?.()
  }

  root.render(<Toast type={type} className={props.className || ''} text={props.text || ''} svg={props.svg || null} />)

  let duration = props.duration
  if (duration === undefined || duration === null) {
    duration = 2000
  }

  if (duration < 1000) {
    duration = duration * 1000
  }

  // 时间 0 为不关闭
  if (duration !== 0) {
    setTimeout(removeToast, duration)
  }
}

// info
Toast.info = (props: IMToastProps) => {
  createToast(props, 1)
}

// success
Toast.success = (props: IMToastProps) => {
  createToast(props, 2)
}

// warning
Toast.warning = (props: IMToastProps) => {
  createToast(props, 3)
}

// error
Toast.error = (props: IMToastProps) => {
  createToast(props, 4)
}

export default Toast
