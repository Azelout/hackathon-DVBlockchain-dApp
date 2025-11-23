import '@mysten/dapp-kit/dist/index.css'
import '@radix-ui/themes/styles.css'
import '@suiware/kit/main.css'
import SuiProvider from '@suiware/kit/SuiProvider'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { FC, StrictMode, useState, useEffect } from 'react'
import IndexPage from '~~/dapp/pages/IndexPage'
import PlayerInterface from '~~/dapp/pages/PlayerInterface'
import CombatPage from '~~/dapp/pages/CombatPage'
import ShopPage from '~~/dapp/pages/ShopPage'
import PracticePage from '~~/dapp/pages/PracticePage'
import { APP_NAME } from '~~/config/main'
import { getThemeSettings } from '~~/helpers/theme'
import useNetworkConfig from '~~/hooks/useNetworkConfig'
import ThemeProvider from '~~/providers/ThemeProvider'
import '~~/styles/index.css'
import { ENetwork } from '~~/types/ENetwork'

const themeSettings = getThemeSettings()

const MainContent: FC = () => {
  const currentAccount = useCurrentAccount()
  const [currentPage, setCurrentPage] = useState<'home' | 'player' | 'combat' | 'shop' | 'practice'>('home')

  useEffect(() => {
    if (currentAccount) {
      setCurrentPage('player')
    } else {
      setCurrentPage('home')
    }
  }, [currentAccount])

  const renderPage = () => {
    switch (currentPage) {
      case 'player':
        return <PlayerInterface onNavigate={(page: string) => setCurrentPage(page as any)} />
      case 'combat':
        return <CombatPage onNavigate={(page: string) => setCurrentPage(page as any)} />
      case 'shop':
        return <ShopPage onNavigate={(page: string) => setCurrentPage(page as any)} />
      case 'practice':
        return <PracticePage onNavigate={(page: string) => setCurrentPage(page as any)} />
      default:
        return (
          <div>
            <IndexPage />
            {/* Optional: Keep manual button for testing if needed, or remove if auto-switch is sufficient */}

          </div>
        )
    }
  }

  return (
    <>
      {renderPage()}

    </>
  )
}

const App: FC = () => {
  const { networkConfig } = useNetworkConfig()

  return (
    <StrictMode>
      <ThemeProvider>
        <SuiProvider
          customNetworkConfig={networkConfig}
          defaultNetwork={ENetwork.LOCALNET}
          walletAutoConnect={false}
          walletStashedName={APP_NAME}
          themeSettings={themeSettings}
        >
          <MainContent />
        </SuiProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
