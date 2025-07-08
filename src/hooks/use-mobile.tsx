
import * as React from "react"

const _mb = 768

export function useIsMobile() {
  const [_im, _sim] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const _cd = () => {
      _sim(window.innerWidth < _mb)
    }

    _cd()

    const _mql = window.matchMedia(`(max-width: ${_mb - 1}px)`)
    const _oc = () => _cd()
    
    window.addEventListener('resize', _oc)
    _mql.addEventListener("change", _oc)

    return () => {
      window.removeEventListener('resize', _oc)
      _mql.removeEventListener("change", _oc)
    }
  }, [])

  return !!_im
}
