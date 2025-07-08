
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkDevice()

    // Add event listener for resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => checkDevice()
    
    // Use both resize and matchMedia for better compatibility
    window.addEventListener('resize', onChange)
    mql.addEventListener("change", onChange)

    return () => {
      window.removeEventListener('resize', onChange)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
