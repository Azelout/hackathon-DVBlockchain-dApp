import React from 'react';

/**
 * ShopPage Component
 * 
 * This page displays the shop interface where players can purchase items.
 */
const ShopPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div 
      className="flex flex-col h-screen text-white p-4"
      style={{
        background: '#000000',
        border: '4px solid',
        borderImage: 'linear-gradient(145deg, #ffffff, #b0b0b0, #e8e8e8, #909090, #f0f0f0, #a0a0a0, #d8d8d8) 1',
        boxShadow: `
          inset 0 0 20px rgba(255,255,255,0.1),
          0 0 30px rgba(255,255,255,0.15)
        `
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 
          className="text-5xl font-black tracking-wider"
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
          SHOP
        </h1>
        
        <button
          onClick={() => onNavigate('player')}
          className="relative px-6 py-2 rounded-3xl font-black text-lg text-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden group"
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
          <span className="relative z-10">Back to Deck</span>
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

      {/* Shop Content */}
      <div className="flex-grow flex items-start pt-20 justify-center pr-32">
        <div className="flex flex-row items-center gap-32">
          <div className="relative group">
            <img 
              src="/shop_question_mark.jpg" 
              alt="Shop" 
              className="max-w-sm max-h-[300px] object-contain drop-shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Semi-transparent silver overlay */}
            <div 
              className="absolute inset-0 -m-8 rounded-3xl overflow-hidden group transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(184,184,184,0.25) 15%, rgba(232,232,232,0.3) 30%, rgba(160,160,160,0.25) 45%, rgba(240,240,240,0.3) 60%, rgba(144,144,144,0.25) 75%, rgba(224,224,224,0.3) 90%, rgba(192,192,192,0.25) 100%)',
                boxShadow: `
                  0 20px 40px rgba(0,0,0,0.6),
                  0 10px 20px rgba(0,0,0,0.4),
                  inset 0 3px 8px rgba(255,255,255,0.5),
                  inset 0 -3px 8px rgba(0,0,0,0.3),
                  inset 3px 0 8px rgba(255,255,255,0.3),
                  inset -3px 0 8px rgba(0,0,0,0.2),
                  0 0 20px rgba(255,255,255,0.2)
                `,
                transform: 'perspective(1000px) rotateX(2deg)'
              }}
            >
              {/* Hover reflection effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(208,208,208,0.3) 20%, rgba(255,255,255,0.4) 40%, rgba(176,176,176,0.3) 60%, rgba(255,255,255,0.4) 80%, rgba(200,200,200,0.3) 100%)',
                  boxShadow: `
                    0 25px 50px rgba(0,0,0,0.7),
                    inset 0 4px 12px rgba(255,255,255,0.6),
                    inset 0 -4px 12px rgba(0,0,0,0.4),
                    0 0 30px rgba(255,255,255,0.3)
                  `
                }}
              />
            </div>
          </div>

          {/* Promotional text */}
          <div className="text-white text-center max-w-md">
            <h2 
              className="text-3xl font-black mb-4"
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #e0e0e0 25%, #c0c0c0 50%, #f5f5f5 75%, #d0d0d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              }}
            >
              Try your luck
            </h2>
            <p className="text-xl text-gray-300 whitespace-nowrap">
              ✧ Crack a booster and uncover the unexpected! ✧
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
