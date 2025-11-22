import React, { useEffect, useState } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import usePlayerCards from '~~/dapp/hooks/usePlayerCards';
import CardComponent from '~~/dapp/components/CardComponent';
import useGameActions from '~~/dapp/hooks/useGameActions';
import { fullStructName } from '~~/helpers/network';
import useNetworkConfig from '~~/hooks/useNetworkConfig';
import { ENNEMY_PLAYER_ADRESS, CONTRACT_PACKAGE_VARIABLE_NAME } from '~~/config/network';

interface PlayerState {
    allCards: any[];
    inventory: any[]; // 7 random cards
    active: any[];    // 3 random cards from inventory
}

const CombatPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const currentAccount = useCurrentAccount();
    const { createLobby, joinLobby, playTurn, swapCard, resolveGame, startPocGame } = useGameActions();
    const { useNetworkVariable } = useNetworkConfig();
    const packageId = useNetworkVariable(CONTRACT_PACKAGE_VARIABLE_NAME);

    // Fetch data
    const { data: myCardsData, isPending: myLoading } = usePlayerCards(currentAccount?.address);

    // Fetch Lobbies
    const { data: lobbies, refetch: refetchLobbies } = useSuiClientQuery('getOwnedObjects', {
        owner: currentAccount?.address || '',
        filter: {
            StructType: fullStructName(packageId, 'game::Lobby'),
        },
        options: { showContent: true }
    });

    // Fetch Games
    const { data: games, refetch: refetchGames } = useSuiClientQuery('getOwnedObjects', {
        owner: currentAccount?.address || '',
        filter: {
            StructType: fullStructName(packageId, 'game::Game'),
        },
        options: { showContent: true }
    });

    const [myState, setMyState] = useState<PlayerState>({ allCards: [], inventory: [], active: [] });
    const [gameState, setGameState] = useState<any>(null); // Store the active game object
    const [activeGameId, setActiveGameId] = useState<string | null>(null);

    // Fetch specific Game Object (for Shared Objects)
    const { data: activeGameData } = useSuiClientQuery('getObject', {
        id: activeGameId || '',
        options: { showContent: true }
    }, {
        enabled: !!activeGameId
    });

    // Update gameState when activeGameData is fetched
    useEffect(() => {
        if (activeGameData?.data) {
            setGameState(activeGameData);
        }
    }, [activeGameData]);

    // Helper to filter game cards
    const filterGameCards = (data: any[]) => {
        if (!data) return [];
        return data.filter((card: any) => {
            const gameField = card.data?.content?.fields?.game;
            return gameField === "Game Card";
        });
    };

    // Helper to select random cards
    const selectRandomCards = (cards: any[], count: number) => {
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Initialize Player State
    useEffect(() => {
        if (myCardsData?.data) {
            const gameCards = filterGameCards(myCardsData.data);
            setMyState(prev => ({ ...prev, allCards: gameCards }));
        }
    }, [myCardsData]);

    // Initialize Game State from fetched games (Legacy/Owned)
    useEffect(() => {
        if (games?.data && games.data.length > 0) {
            // Just pick the first game found for now
            setGameState(games.data[0]);
        }
    }, [games]);

    const handlePlayTurn = () => {
        if (!gameState) return;
        playTurn(gameState.data.objectId, () => {
            alert("Turn Played!");
            refetchGames();
        });
    };

    const handleSwapCard = () => {
        if (!gameState) return;
        swapCard(gameState.data.objectId, () => {
            alert("Card Swapped!");
            refetchGames();
        });
    };

    const handleResolveGame = () => {
        if (!gameState) return;
        resolveGame(gameState.data.objectId, () => {
            alert("Game Resolved! Winner determined.");
            refetchGames();
        });
    };

    const handleCreateLobby = () => {
        if (myState.allCards.length < 7) {
            alert("You need at least 7 Game Cards to play!");
            return;
        }
        // Select 7 random cards to pledge
        const cardsToPledge = selectRandomCards(myState.allCards, 7);
        createLobby(cardsToPledge, () => {
            alert("Lobby Created! (Check console for ID if needed, or wait for UI update)");
            refetchLobbies();
        });
    };

    // For now, since we can't easily list all shared lobbies without an indexer,
    // we will provide a manual input for Lobby ID to join, or just show if we created one.
    const [inputLobbyId, setInputLobbyId] = useState("");

    const handleJoinLobby = () => {
        // PoC: Hijack Join Lobby to start game with Enemy
        if (myState.allCards.length < 7) {
            alert("You need at least 7 Game Cards to play!");
            return;
        }
        const cardsToPledge = selectRandomCards(myState.allCards, 7);

        // Use PoC function
        startPocGame(cardsToPledge, ENNEMY_PLAYER_ADRESS, (result) => {
            alert("PoC Game Started! (Check console/UI)");

            // Extract Game ID from effects
            const createdObjects = result.effects?.created || [];
            // We look for the object that is NOT a Coin (assuming Game is the only other created object)
            // A better way would be to check the type, but for PoC this is fine.
            // Or we can just fetch all created objects and check their type.

            // For now, let's try to find the Game object ID.
            // Since we don't have the type in the effects easily without fetching, 
            // we will just refetch games (which might fail if shared) AND try to set it manually if we can identify it.

            // Actually, for shared objects, they appear in `created` list.
            // Let's just log it for now and try to fetch it.
            console.log("Created Objects:", createdObjects);

            // Hack: The Game object is likely the one that is NOT the Coin (if any) or just one of them.
            // Let's try to fetch the first created object that is a shared object.
            const gameObj = createdObjects.find((obj: any) => obj.owner?.Shared);

            if (gameObj) {
                console.log("Found Game Object ID:", gameObj.reference.objectId);
                // We need to fetch the object content to set gameState
                // We can't use setGameState directly with the effect object.
                // We need to trigger a fetch.
                // Let's use a new state `activeGameId` to trigger a specific fetch.
                setActiveGameId(gameObj.reference.objectId);
            } else {
                console.log("No Game Object found in effects");
                // Fallback
                refetchGames();
            }
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white p-4 overflow-hidden">

            {/* Back Button */}
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={() => onNavigate('player')}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                    ← Back
                </button>
            </div>

            {!gameState ? (
                // LOBBY / SETUP VIEW
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <h1 className="text-3xl font-bold text-blue-400">Combat Arena</h1>

                    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col space-y-4 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-center">Start a Duel</h2>

                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={handleCreateLobby}
                                disabled={myState.allCards.length < 7}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Lobby (Host)
                            </button>
                            <p className="text-xs text-gray-400 text-center">Requires 7 Game Cards</p>
                        </div>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-600"></div>
                            <span className="flex-shrink mx-4 text-gray-400">OR</span>
                            <div className="flex-grow border-t border-gray-600"></div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                placeholder="Enter Lobby ID to Join"
                                value={inputLobbyId}
                                onChange={(e) => setInputLobbyId(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={handleJoinLobby}
                                disabled={myState.allCards.length < 7}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Game (PoC)
                            </button>
                        </div>
                    </div>

                    {/* Temporary: List owned lobbies to help testing */}
                    {lobbies?.data && lobbies.data.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                            <h3 className="text-sm font-bold text-gray-300 mb-2">Your Lobbies (Share ID with P2):</h3>
                            <ul className="space-y-1">
                                {lobbies.data.map((l: any) => (
                                    <li key={l.data.objectId} className="text-xs font-mono bg-gray-900 p-2 rounded select-all cursor-pointer hover:text-blue-300">
                                        {l.data.objectId}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                // GAME VIEW
                <div className="flex flex-col h-full pt-12">
                    {/* Game Info / Actions */}
                    <div className="absolute top-4 right-4 z-20 flex space-x-2">
                        <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
                            <span className="text-xs text-gray-400 block">Game ID</span>
                            <span className="text-xs font-mono">{gameState.data.objectId.slice(0, 6)}...</span>
                        </div>
                        <button onClick={() => refetchGames()} className="bg-gray-700 p-2 rounded hover:bg-gray-600">↻</button>
                    </div>

                    {/* ENEMY SECTION (Top) */}
                    <div className="flex flex-col items-center space-y-4 flex-1 justify-start">
                        <div className="bg-red-900 px-6 py-2 rounded-full border border-red-700 shadow-lg">
                            <h2 className="text-xl font-bold text-red-100">Enemy</h2>
                            {/* We can't easily know enemy address without parsing the game object fields, which requires a move call or better query. 
                          For now, just placeholder or try to read from content if available. 
                      */}
                        </div>

                        {/* Enemy Cards (Placeholder for now as we can't see them easily without parsing shared object fields) */}
                        <div className="flex space-x-2 opacity-70">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-[100px] h-[140px] bg-gray-800 border border-gray-600 rounded-md flex items-center justify-center">
                                    <span className="text-2xl">?</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTION BAR (Center) */}
                    <div className="flex items-center justify-center py-4 space-x-4 z-30">
                        <button
                            onClick={handlePlayTurn}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-bold shadow-lg border-2 border-yellow-400"
                        >
                            Reveal Card (Next Turn)
                        </button>
                        <button
                            onClick={handleSwapCard}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold shadow-lg border-2 border-purple-400"
                        >
                            Swap Card
                        </button>
                        <button
                            onClick={handleResolveGame}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg border-2 border-red-400"
                        >
                            End Game (Resolve)
                        </button>
                    </div>

                    {/* PLAYER SECTION (Bottom) */}
                    <div className="flex flex-col items-center space-y-4 flex-1 justify-end pb-8">
                        {/* We need to show the cards in the Game object, not the inventory. 
                       But reading fields of a shared object from `getOwnedObjects` is tricky if we are not the owner (but we are one of them?).
                       Actually, `getOwnedObjects` might not return the shared object fields if we are not the direct owner.
                       We might need `getObject` with the ID.
                       For this hackathon step, let's assume we just show the controls and basic UI.
                       Real card display requires fetching the Game Object details.
                   */}
                        <div className="flex space-x-4">
                            {/* Placeholder for Hand */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-[120px] h-[180px] bg-gray-800 border-2 border-blue-500 rounded-xl flex items-center justify-center">
                                    <span className="text-gray-400">Hand {i}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-900 px-6 py-2 rounded-full border border-blue-700 shadow-lg">
                            <h2 className="text-xl font-bold text-blue-100">You</h2>
                            <p className="text-xs text-blue-300 truncate max-w-[200px]">{currentAccount?.address}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CombatPage;
