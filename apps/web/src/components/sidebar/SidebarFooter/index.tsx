import type { ReactElement } from 'react'
import { useEffect } from 'react'

import {
  SidebarList,
  SidebarListItemButton,
  SidebarListItemIcon,
  SidebarListItemText,
} from '@/components/sidebar/SidebarList'
import { loadBeamer } from '@/services/beamer'
import { useAppSelector } from '@/store'
import { CookieAndTermType, hasConsentFor } from '@/store/cookiesAndTermsSlice'
import { ListItem, SvgIcon, Typography, Divider } from '@mui/material'
import DebugToggle from '../DebugToggle'
import { HELP_CENTER_URL, IS_PRODUCTION } from '@/config/constants'
import { useCurrentChain } from '@/hooks/useChains'
import ProtofireLogo from '@/public/images/protofire-logo.svg'
import SuggestionIcon from '@/public/images/sidebar/lightbulb_icon.svg'
import SafeLogo from '@/public/images/logo-text.svg'
import ExternalLink from '@/components/common/ExternalLink'
import Track from '@/components/common/Track'
import HelpCenterIcon from '@/public/images/sidebar/help-center.svg'
import { OVERVIEW_EVENTS } from '@/services/analytics'
import IndexingStatus from '@/components/sidebar/IndexingStatus'

export const NEW_SUGGESTION_FORM = 'https://safe-feature-request.protofire.io'

const SidebarFooter = (): ReactElement => {
  const chain = useCurrentChain()
  const hasBeamerConsent = useAppSelector((state) => hasConsentFor(state, CookieAndTermType.UPDATES))

  useEffect(() => {
    // Initialize Beamer when consent was previously given
    if (hasBeamerConsent && chain?.shortName) {
      loadBeamer(chain.shortName)
    }
  }, [hasBeamerConsent, chain?.shortName])

  return (
    <SidebarList>
      {!IS_PRODUCTION && (
        <>
          <ListItem disablePadding>
            <DebugToggle />
          </ListItem>

          <Divider flexItem />
        </>
      )}

      {/* <Track {...OVERVIEW_EVENTS.WHATS_NEW}>
        <ListItem disablePadding>
          <SidebarListItemButton id={BEAMER_SELECTOR}>
            <SidebarListItemIcon color="primary">
              <HelpCenterIcon />
            </SidebarListItemIcon>
            <SidebarListItemText data-testid="list-item-need-help" bold>
              What&apos;s New
            </SidebarListItemText>
          </SidebarListItemButton>
        </ListItem>
      </Track> */}

      {/* Help Center link removed. To restore, import HELP_CENTER_URL from '@/config/constants' */}
      <Track {...OVERVIEW_EVENTS.HELP_CENTER}>
        <ListItem disablePadding>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={HELP_CENTER_URL}
            style={{ width: '100%', marginBottom: '3px' }}
          >
            <SidebarListItemButton>
              <SidebarListItemIcon color="primary">
                <HelpCenterIcon />
              </SidebarListItemIcon>
              <SidebarListItemText data-testid="list-item-need-help" bold>
                Need help?
              </SidebarListItemText>
            </SidebarListItemButton>
          </a>
        </ListItem>
      </Track>
      <Track {...OVERVIEW_EVENTS.SUGGESTIONS}>
        <ListItem disablePadding>
          <a target="_blank" rel="noopener noreferrer" href={NEW_SUGGESTION_FORM} style={{ width: '100%' }}>
            <SidebarListItemButton style={{ backgroundColor: '#5FDDFF', color: 'black' }}>
              <SidebarListItemIcon color="primary">
                <SuggestionIcon />
              </SidebarListItemIcon>
              <SidebarListItemText bold>New Features Suggestion?</SidebarListItemText>
            </SidebarListItemButton>
          </a>
        </ListItem>
      </Track>

      <ListItem>
        <SvgIcon component={SafeLogo} inheritViewBox sx={{ height: '2em', mb: '-5px', width: '100%' }} />
      </ListItem>

      <ListItem>
        <SidebarListItemText>
          <Typography variant="caption">
            Supported by{' '}
            <SvgIcon
              component={ProtofireLogo}
              inheritViewBox
              fontSize="small"
              sx={{ verticalAlign: 'middle', mx: 0.5 }}
            />
            <ExternalLink href="https://protofire.io" sx={{ textDecoration: 'none' }} noIcon>
              Protofire
            </ExternalLink>
          </Typography>
        </SidebarListItemText>
      </ListItem>

      <Divider flexItem />

      {!IS_PRODUCTION && <IndexingStatus />}
    </SidebarList>
  )
}

export default SidebarFooter
