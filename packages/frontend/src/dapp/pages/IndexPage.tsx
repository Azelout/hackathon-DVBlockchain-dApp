import { useCurrentAccount } from '@mysten/dapp-kit'
import { FC } from 'react'
import GreetingForm from '~~/dapp/components/GreetingForm'
import Layout from '~~/components/layout/Layout'
import NetworkSupportChecker from '../../components/NetworkSupportChecker'
import CustomConnectButton from '~~/components/CustomConnectButton'

const IndexPage: FC = () => {
  const currentAccount = useCurrentAccount()

  return (
    <Layout>
      <NetworkSupportChecker />
      <div className="flex flex-grow flex-col items-center justify-center rounded-md p-3 h-full gap-12">
        {currentAccount ? (
          <GreetingForm />
        ) : (
          <>
            <h1 
              className="text-7xl font-black tracking-wider"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                fontFamily: 'Impact, "Arial Black", sans-serif',
                letterSpacing: '0.1em'
              }}
            >
              CLASH OF CARDS
            </h1>
            <div className="flex items-center justify-center">
              <CustomConnectButton />
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
