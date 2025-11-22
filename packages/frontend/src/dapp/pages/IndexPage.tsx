import { useCurrentAccount } from '@mysten/dapp-kit'
import { FC } from 'react'
import GreetingForm from '~~/dapp/components/GreetingForm'
import Layout from '~~/components/layout/Layout'
import NetworkSupportChecker from '../../components/NetworkSupportChecker'

const IndexPage: FC = () => {
  const currentAccount = useCurrentAccount()

  return (
    <Layout>
      <NetworkSupportChecker />
      <div className="justify-content flex flex-grow flex-col items-center justify-center rounded-md p-3">
        {currentAccount ? (
          <GreetingForm />
        ) : (
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Welcome to the App</h1>
            <p className="text-lg">Please connect your wallet to continue.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default IndexPage
