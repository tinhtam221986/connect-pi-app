import { ShoppingCart, Edit, Box, FileText } from "lucide-react";

interface ProductCardProps {
    product: any;
    isOwner: boolean;
    onBuy?: () => void;
}

export function ProductCard({ product, isOwner, onBuy }: ProductCardProps) {
    // formatCurrency typically formats to USD/VND, but here we deal with Pi.
    // We'll just display "π {amount}" manually.

    return (
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group relative">
            {/* Image */}
            <div className="aspect-square bg-gray-800 relative">
                {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                        {product.productType === 'digital' ? <FileText size={32}/> : <Box size={32}/>}
                    </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] uppercase font-bold text-white flex items-center gap-1">
                    {product.productType === 'digital' ? (
                        <><FileText size={10} className="text-blue-400" /> Digital</>
                    ) : (
                        <><Box size={10} className="text-orange-400" /> Physical</>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-bold text-sm text-white line-clamp-1">{product.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-purple-400 font-bold">π {product.price}</span>

                    {isOwner ? (
                        <button className="p-1.5 bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                            <Edit size={14} />
                        </button>
                    ) : (
                        <button
                            onClick={onBuy}
                            className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-200 flex items-center gap-1"
                        >
                            <ShoppingCart size={12} /> Buy
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
