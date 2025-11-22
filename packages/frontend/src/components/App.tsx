import '@mysten/dapp-kit/dist/index.css'
import '@radix-ui/themes/styles.css'
import '@suiware/kit/main.css'
import SuiProvider from '@suiware/kit/SuiProvider'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { FC, StrictMode, useState, useEffect } from 'react'
import IndexPage from '~~/dapp/pages/IndexPage'
import PlayerInterface from '~~/dapp/pages/PlayerInterface'
import CombatPage from '~~/dapp/pages/CombatPage'
import { APP_NAME } from '~~/config/main'
import { getThemeSettings } from '~~/helpers/theme'
import useNetworkConfig from '~~/hooks/useNetworkConfig'
import ThemeProvider from '~~/providers/ThemeProvider'
import '~~/styles/index.css'
import { ENetwork } from '~~/types/ENetwork'

const themeSettings = getThemeSettings()

const MainContent: FC = () => {
  const currentAccount = useCurrentAccount()
  const [currentPage, setCurrentPage] = useState<'home' | 'player' | 'combat'>('home')

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
      default:
        return (
          <div>
            <IndexPage />
            {/* Optional: Keep manual button for testing if needed, or remove if auto-switch is sufficient */}
            <div className="fixed bottom-4 right-4">
              <button
                onClick={() => setCurrentPage('player')}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700"
              >
                Dev: Force Player View
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      {renderPage()}
      {currentPage === 'player' && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>
      )}
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
