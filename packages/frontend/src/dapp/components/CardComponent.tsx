import { SuiObjectResponse } from '@mysten/sui/client'
import { getResponseDisplayField } from '~~/helpers/network'

interface CardComponentProps {
    card: SuiObjectResponse
}

const CardComponent: React.FC<CardComponentProps> = ({ card }) => {
    const name = getResponseDisplayField(card, 'name') || 'Unknown Card'
    const img = getResponseDisplayField(card, 'image_url')
    const description = getResponseDisplayField(card, 'description')

    return (
        <div className="min-w-[160px] h-[240px] bg-gray-800 border border-gray-600 rounded-xl overflow-hidden flex flex-col shadow-lg hover:scale-105 transition-transform duration-200">
            {/* Image Section */}
            <div className="h-[140px] w-full bg-gray-700 relative">
                {img ? (
                    <img
                        src={img}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="p-3 flex flex-col flex-grow justify-between bg-gray-900">
                <div>
                    <h3 className="font-bold text-white text-sm truncate" title={name}>{name}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2" title={description || ''}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CardComponent
