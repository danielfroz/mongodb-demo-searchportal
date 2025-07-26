'use client'

import ReduxProvider from '@/lib/redux/provider'

const Providers = ({ children }) => {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  )
}

export default Providers