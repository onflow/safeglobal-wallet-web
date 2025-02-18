import useSafeInfo from '@/hooks/useSafeInfo'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import { Typography } from '@mui/material'
import { useCallback, useEffect } from 'react'

const LS_KEY = 'native_wc_dapps'

const WcSampleDapps = ({ onUnload }: { onUnload: () => void }) => {
  // Only show the sample dApps list once
  useEffect(() => {
    return onUnload
  }, [onUnload])

  return (
    <Typography
      variant="body2"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={3}
      component="div"
    ></Typography>
  )
}

const WcNoSessions = () => {
  const { safeLoaded } = useSafeInfo()
  const [showDapps = true, setShowDapps] = useLocalStorage<boolean>(LS_KEY)

  const onUnload = useCallback(() => {
    setShowDapps(false)
  }, [setShowDapps])

  const sampleDapps = showDapps && safeLoaded && <WcSampleDapps onUnload={onUnload} />

  return (
    <>
      <Typography variant="body2" textAlign="center" color="text.secondary">
        No dApps are connected yet.{sampleDapps ? ' Try one of these:' : ''}
      </Typography>

      {sampleDapps}
    </>
  )
}

export default WcNoSessions
