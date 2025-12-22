import { useState, useRef } from 'react';
import { usePi } from '@/components/pi/pi-provider';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Plus, Box, FileText, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
    const { user } = usePi();
    const [loading, setLoading] = useState(false);
    const [productType, setProductType] = useState<'physical' | 'digital'>('physical');
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '1',
        digitalContent: '',
        shippingName: 'Standard Shipping',
        shippingPrice: '0',
        shippingDays: '3-5',
        affiliateRate: '0'
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic client-side check
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        try {
            const toastId = toast.loading('Uploading image...');
            const formData = new FormData();
            formData.append('file', file);

            // Reuse existing image upload endpoint
            const res = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setImages(prev => [...prev, data.url]);
            toast.dismiss(toastId);
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) return;

        if (!formData.title || !formData.price || !formData.description) {
            toast.error('Please fill in required fields');
            return;
        }

        if (images.length === 0) {
            toast.error('Please add at least one image');
            return;
        }

        if (productType === 'digital' && !formData.digitalContent) {
            toast.error('Digital products need content (link or code)');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                sellerId: user.uid,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                images,
                productType,
                stock: parseInt(formData.stock),
                digitalContent: productType === 'digital' ? formData.digitalContent : undefined,
                shippingFee: productType === 'physical' ? parseFloat(formData.shippingPrice) : 0,
                affiliateRate: parseFloat(formData.affiliateRate) / 100, // Convert % to decimal
                shippingOptions: productType === 'physical' ? [{
                    name: formData.shippingName,
                    price: parseFloat(formData.shippingPrice),
                    estimatedDays: formData.shippingDays
                }] : []
            };

            const res = await fetch('/api/shop/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Product created successfully!');
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Add New Product</h3>

            {/* Type Selector */}
            <div className="flex gap-4 mb-6">
                <button
                    type="button"
                    onClick={() => setProductType('physical')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                        productType === 'physical'
                            ? "bg-purple-900/40 border-purple-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                    )}
                >
                    <Box size={24} />
                    <span className="text-sm font-bold">Physical Good</span>
                </button>
                <button
                    type="button"
                    onClick={() => setProductType('digital')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                        productType === 'digital'
                            ? "bg-purple-900/40 border-purple-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400"
                    )}
                >
                    <FileText size={24} />
                    <span className="text-sm font-bold">Digital / Link</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Images */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Product Images</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((url, i) => (
                            <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 border border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-gray-400 transition-colors"
                        >
                            <Upload size={20} />
                            <span className="text-[10px] mt-1">Add</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Product Title"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
                    />

                    <textarea
                        placeholder="Description..."
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
                    />

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs text-gray-400 block mb-1">Price (Pi)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-xs text-gray-400 block mb-1">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({...formData, stock: e.target.value})}
                                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Commission Setting */}
                <div className="bg-gray-800/30 rounded-xl p-3">
                    <label className="text-xs text-gray-400 block mb-1">Affiliate Commission (%)</label>
                    <input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={formData.affiliateRate}
                        onChange={e => setFormData({...formData, affiliateRate: e.target.value})}
                        className="w-full bg-black border border-gray-700 rounded-xl p-2 text-sm text-white"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Percent of product price paid to promoters.</p>
                </div>

                {/* Conditional Fields */}
                {productType === 'digital' ? (
                     <div className="bg-purple-900/10 border border-purple-500/30 rounded-xl p-3">
                        <label className="text-xs font-bold text-purple-400 block mb-1">Digital Content (Hidden until purchased)</label>
                        <textarea
                            placeholder="Enter the secret link, code, or content here..."
                            rows={3}
                            value={formData.digitalContent}
                            onChange={e => setFormData({...formData, digitalContent: e.target.value})}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-purple-500 outline-none"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">This will be securely stored and only revealed to the buyer after successful payment.</p>
                     </div>
                ) : (
                    <div className="bg-gray-800/50 rounded-xl p-3 space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase">Domestic Shipping Fee (Pi)</h4>
                         <input
                            type="number"
                            placeholder="Shipping Cost (e.g. 2.5)"
                            value={formData.shippingPrice}
                            onChange={e => setFormData({...formData, shippingPrice: e.target.value})}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2 text-sm text-white"
                        />
                         <input
                            type="text"
                            placeholder="Est. Delivery (e.g. 3-5 days)"
                            value={formData.shippingDays}
                            onChange={e => setFormData({...formData, shippingDays: e.target.value})}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2 text-xs text-white mt-2"
                        />
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-800 rounded-xl text-sm font-bold text-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-purple-600 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    );
}
