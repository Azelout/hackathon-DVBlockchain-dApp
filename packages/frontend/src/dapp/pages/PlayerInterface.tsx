import React from 'react';

/**
 * PlayerInterface Component
 * 
 * This page serves as the main interface for the player.
 * It provides options to find other players or practice alone.
 * It also displays the player's deck of objects.
 */
const PlayerInterface: React.FC = () => {

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
        <h2 className="text-xl font-bold mb-4 text-center">Your Deck</h2>
        
        {/* Horizontal Deck Container */}
        <div className="flex overflow-x-auto space-x-4 px-4 pb-2 justify-center">
          
          {/* Placeholder Card 1 */}
          <div className="min-w-[100px] h-[140px] bg-gray-800 border border-gray-600 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-sm">Object 1</span>
          </div>

          {/* Placeholder Card 2 */}
          <div className="min-w-[100px] h-[140px] bg-gray-800 border border-gray-600 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-sm">Object 2</span>
          </div>

          {/* Placeholder Card 3 */}
          <div className="min-w-[100px] h-[140px] bg-gray-800 border border-gray-600 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-sm">Object 3</span>
          </div>

          {/* Dynamic Content Placeholder */}
          {/* 
            TODO: Map through actual player objects here.
            Example:
            {deck.map((item) => (
              <CardComponent key={item.id} data={item} />
            ))}
          */}
          
          <div className="min-w-[100px] h-[140px] border-2 border-dashed border-gray-600 rounded-md flex items-center justify-center opacity-50">
            <span className="text-gray-500 text-xs text-center px-2">Empty Slot</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PlayerInterface;
