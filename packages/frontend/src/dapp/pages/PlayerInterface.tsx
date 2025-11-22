import React from 'react';
import useOwnCards from '~~/dapp/hooks/useOwnCards';
import CardComponent from '~~/dapp/components/CardComponent';

/**
 * PlayerInterface Component
 * 
 * This page serves as the main interface for the player.
 * It provides options to find other players or practice alone.
 * It also displays the player's deck of objects.
 */
const PlayerInterface: React.FC = () => {
  const { data: cards, isPending, error } = useOwnCards();

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
    // TODO: Implement actual navigation (e.g., using react-router-dom)
    // navigate(destination);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">

      {/* Top Section: Action Buttons */}
      <div className="flex flex-col items-center justify-center space-y-4 mt-10">
        <button
          onClick={() => handleNavigation('/find-players')}
          className="w-64 py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition duration-200 shadow-md"
        >
          Find Other Players
        </button>

        <button
          onClick={() => handleNavigation('/practice')}
          className="w-64 py-3 px-6 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition duration-200 shadow-md"
        >
          Practice and Improve Yourself
        </button>
      </div>

      {/* Spacer to push deck to the bottom */}
      <div className="flex-grow"></div>

      {/* Bottom Section: Deck of Objects */}
      <div className="w-full border-t border-gray-700 pt-4 pb-8">
        <h2 className="text-xl font-bold mb-4 text-center">Your Cards</h2>

        {/* Horizontal Deck Container */}
        <div className="flex overflow-x-auto space-x-4 px-4 pb-2 justify-center min-h-[260px]">

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
          <div className="min-w-[160px] h-[240px] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center opacity-50 flex-shrink-0">
            <span className="text-gray-500 text-xs text-center px-2">Empty Slot</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PlayerInterface;
