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
import { APP_NAME } from '~~/config/main'
import { getThemeSettings } from '~~/helpers/theme'
import useNetworkConfig from '~~/hooks/useNetworkConfig'
import ThemeProvider from '~~/providers/ThemeProvider'
import '~~/styles/index.css'
import { ENetwork } from '~~/types/ENetwork'

const themeSettings = getThemeSettings()

const MainContent: FC = () => {
  const currentAccount = useCurrentAccount()
  const [currentPage, setCurrentPage] = useState<'home' | 'player' | 'combat' | 'shop'>('home')

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
            className="relative px-8 py-3 rounded-3xl font-black text-xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #b8b8b8 15%, #e8e8e8 30%, #a0a0a0 45%, #f0f0f0 60%, #909090 75%, #e0e0e0 90%, #c0c0c0 100%)',
              boxShadow: `
                0 20px 40px rgba(0,0,0,0.6),
                0 10px 20px rgba(0,0,0,0.4),
                inset 0 3px 8px rgba(255,255,255,0.9),
                inset 0 -3px 8px rgba(0,0,0,0.4),
                inset 3px 0 8px rgba(255,255,255,0.5),
                inset -3px 0 8px rgba(0,0,0,0.3),
                0 0 20px rgba(255,255,255,0.3)
              `,
              textShadow: '0 2px 4px rgba(255,255,255,0.9), 0 -1px 2px rgba(0,0,0,0.3)',
              transform: 'perspective(1000px) rotateX(2deg)'
            }}
          >
            <span className="relative z-10">Back to Home</span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #d0d0d0 20%, #ffffff 40%, #b0b0b0 60%, #ffffff 80%, #c8c8c8 100%)',
                boxShadow: `
                  0 25px 50px rgba(0,0,0,0.7),
                  inset 0 4px 12px rgba(255,255,255,1),
                  inset 0 -4px 12px rgba(0,0,0,0.5),
                  0 0 30px rgba(255,255,255,0.5)
                `
              }}
            />
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
