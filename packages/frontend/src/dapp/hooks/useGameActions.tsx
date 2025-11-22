import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { CONTRACT_PACKAGE_VARIABLE_NAME } from '~~/config/network'
import useNetworkConfig from '~~/hooks/useNetworkConfig'

const useGameActions = () => {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
    const { useNetworkVariable } = useNetworkConfig()
    const packageId = useNetworkVariable(CONTRACT_PACKAGE_VARIABLE_NAME)
    const client = useSuiClient()

    const createLobby = (cards: any[], onSuccess?: () => void) => {
        const tx = new Transaction()
        const cardIds = cards.map((c) => c.data.objectId)

        // Convert card IDs to vector<Card> argument
        const vec = tx.makeMoveVec({
            elements: cardIds
        })

        tx.moveCall({
            target: `${packageId}::game::create_lobby`,
            arguments: [vec],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Lobby created', result)
                    if (onSuccess) onSuccess()
                },
                onError: (error) => {
                    console.error('Error creating lobby', error)
                }
            },
        )
    }

    const joinLobby = (lobbyId: string, cards: any[], onSuccess?: () => void) => {
        const tx = new Transaction()
        const cardIds = cards.map((c) => c.data.objectId)

        const vec = tx.makeMoveVec({
            elements: cardIds
        })

        tx.moveCall({
            target: `${packageId}::game::join_lobby`,
            arguments: [
                tx.object(lobbyId),
                vec,
                tx.object('0x8'), // Random object
            ],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Joined lobby', result)
                    if (onSuccess) onSuccess()
                },
                onError: (error) => {
                    console.error('Error joining lobby', error)
                }
            },
        )
    }

    const playTurn = (gameId: string, onSuccess?: () => void) => {
        const tx = new Transaction()
        tx.moveCall({
            target: `${packageId}::game::play_turn`,
            arguments: [tx.object(gameId)],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Turn played', result)
                    if (onSuccess) onSuccess()
                },
            },
        )
    }

    const swapCard = (gameId: string, onSuccess?: () => void) => {
        const tx = new Transaction()
        tx.moveCall({
            target: `${packageId}::game::swap_card`,
            arguments: [
                tx.object(gameId),
                tx.object('0x8'), // Random object
            ],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Card swapped', result)
                    if (onSuccess) onSuccess()
                },
            },
        )
    }

    const resolveGame = (gameId: string, onSuccess?: () => void) => {
        const tx = new Transaction()
        tx.moveCall({
            target: `${packageId}::game::resolve_game`,
            arguments: [
                tx.object(gameId),
                tx.object('0x8'), // Random object
            ],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Game resolved', result)
                    if (onSuccess) onSuccess()
                },
            },
        )
    }

    const startPocGame = (cards: any[], enemyAddress: string, onSuccess?: (result: any) => void) => {
        const tx = new Transaction()
        const cardIds = cards.map((c) => c.data.objectId)

        const vec = tx.makeMoveVec({
            elements: cardIds
        })

        tx.moveCall({
            target: `${packageId}::game::create_poc_game`,
            arguments: [
                vec,
                tx.pure.address(enemyAddress),
                tx.object('0x8'), // Random object
            ],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: async (result) => {
                    console.log('PoC Game Started', result)

                    // Fetch full transaction details to get objectChanges
                    // Retry with delay since transaction needs to be indexed
                    const fetchWithRetry = async (retries = 5, delay = 500) => {
                        for (let i = 0; i < retries; i++) {
                            try {
                                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
                                const txDetails = await client.getTransactionBlock({
                                    digest: result.digest,
                                    options: {
                                        showEffects: true,
                                        showObjectChanges: true,
                                    }
                                })
                                console.log('Transaction Details:', txDetails)
                                if (onSuccess) onSuccess(txDetails)
                                return
                            } catch (error) {
                                if (i === retries - 1) {
                                    console.error('Error fetching transaction details after retries:', error)
                                    if (onSuccess) onSuccess(result)
                                }
                            }
                        }
                    }

                    fetchWithRetry()
                },
                onError: (error) => {
                    console.error('Error starting PoC game', error)
                }
            },
        )
    }

    const mintCard = (onSuccess?: () => void) => {
        const tx = new Transaction()
        for (let i = 0; i < 7; i++) {
            tx.moveCall({
                target: `${packageId}::card::create`,
                arguments: [
                    tx.pure.string(`Warrior ${i + 1}`),
                    tx.pure.string(`https://api.dicebear.com/7.x/avataaars/svg?seed=Warrior${i}`),
                    tx.pure.string('Warrior Card'),
                    tx.pure.u64(10),
                ],
            })
        }

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Card Minted', result)
                    if (onSuccess) onSuccess()
                },
                onError: (error) => {
                    console.error('Error minting card', error)
                }
            },
        )
    }

    const abandonGame = (gameId: string, onSuccess?: () => void) => {
        const tx = new Transaction()
        tx.moveCall({
            target: `${packageId}::game::abandon_game`,
            arguments: [tx.object(gameId)],
        })

        signAndExecuteTransaction(
            {
                transaction: tx as any,
            },
            {
                onSuccess: (result) => {
                    console.log('Game abandoned', result)
                    if (onSuccess) onSuccess()
                },
                onError: (error) => {
                    console.error('Error abandoning game', error)
                }
            },
        )
    }

    return {
        createLobby,
        joinLobby,
        playTurn,
        swapCard,
        resolveGame,
        startPocGame,
        mintCard,
        abandonGame,
    }
}

export default useGameActions
