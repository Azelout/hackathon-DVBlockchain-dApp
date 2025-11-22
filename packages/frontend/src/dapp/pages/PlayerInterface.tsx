import React from 'react';
import useOwnCards from '~~/dapp/hooks/useOwnCards';
import CardComponent from '~~/dapp/components/CardComponent';
import useGameActions from '~~/dapp/hooks/useGameActions';

/**
 * PlayerInterface Component
 * 
 * This page serves as the main interface for the player.
 * It provides options to find other players or practice alone.
 * It also displays the player's deck of objects.
 */
const PlayerInterface: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { data: cards, isPending, error, refetch } = useOwnCards();
  const { mintCard } = useGameActions();

  // Filter cards to only show "Card Game" cards
  const gameCards = React.useMemo(() => {
    if (!cards?.data) return [];
    return cards.data.filter((card: any) => {
      const gameField = card.data?.content?.fields?.game;
      return gameField === "Game Card";
    });
  }, [cards]);

  // Placeholder function for navigation
  const handleNavigation = (destination: string) => {
    console.log(`Navigating to: ${destination}`);
    if (destination === '/find-players') {
      onNavigate('combat');
    }
  };

  return (
    <div 
      className="flex flex-col h-screen text-white p-4"
      style={{
        background: 'radial-gradient(ellipse at center, #2d2d2d 0%, #1a1a1a 35%, #000000 70%, #000000 100%)',
        border: '4px solid',
        borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090, #f0f0f0, #a0a0a0, #d8d8d8) 1',
        boxShadow: `
          inset 0 0 20px rgba(255,255,255,0.1),
          0 0 30px rgba(255,255,255,0.15)
        `
      }}
    >

      {/* Top Section: Action Buttons */}
      <div className="flex flex-row flex-wrap items-center justify-center gap-8 mt-10">
        <button
          onClick={() => handleNavigation('/find-players')}
          className="relative w-80 py-5 px-10 rounded-3xl font-black text-2xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
          <span className="relative z-10">Find Other Players</span>
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

        <button
          onClick={() => handleNavigation('/practice')}
          className="relative w-80 py-5 px-10 rounded-3xl font-black text-2xl text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
          <span className="relative z-10">Practice and Improve Yourself</span>
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

        <button
          onClick={() => mintCard(refetch)}
          className="w-64 py-3 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition duration-200 shadow-md"
        >
          Mint Dev Deck (+7)
        </button>
      </div>

      {/* Spacer to push deck to the bottom */}
      <div className="flex-grow"></div>

      {/* Bottom Section: Deck of Objects */}
      <div 
        className="w-full pt-1 pb-4"
        style={{
          borderTop: '3px solid',
          borderImage: 'linear-gradient(90deg, #909090, #ffffff, #c0c0c0, #f0f0f0, #a0a0a0, #e8e8e8, #b0b0b0, #909090) 1',
          boxShadow: '0 -2px 15px rgba(255,255,255,0.2)'
        }}
      >
        <h2 
          className="text-4xl font-black tracking-wider mb-4 text-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
            fontFamily: 'Impact, "Arial Black", sans-serif',
            letterSpacing: '0.1em'
          }}
        >
          YOUR DECK
        </h2>

        {/* Horizontal Deck Container */}
        <div className="flex overflow-x-auto space-x-4 px-4 pb-2 justify-center min-h-[290px]">

          {isPending && (
            <div className="flex items-center justify-center text-gray-400">
              Loading cards...
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center text-red-400">
              Error loading cards
            </div>
          )}

          {!isPending && !error && gameCards.length === 0 && (
            <div className="flex items-center justify-center text-gray-500 italic">
              Oh no! You don't have any cards!
            </div>
          )}

          {gameCards.map((card: any) => (
            <CardComponent key={card.data?.objectId} card={card} />
          ))}

          {/* Empty Slot Placeholder (always visible to suggest adding more) */}
          <div className="min-w-[180px] h-[270px] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center opacity-50 flex-shrink-0">
            <span className="text-gray-500 text-sm text-center px-2">Empty Slot</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PlayerInterface;
