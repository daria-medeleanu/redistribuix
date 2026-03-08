import { useState } from 'react';

const API_BASE = 'http://localhost:5056/api/v1';

export default function AddDailySaleModal({ isOpen, onClose, onSuccess, product, locationId }) {
    const [quantity, setQuantity] = useState('1');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const qty = parseInt(quantity, 10);
            if (qty <= 0) {
                setError('Quantity must be greater than 0');
                setIsSubmitting(false);
                return;
            }

            const payload = {
                locationId: locationId,
                productId: product.productId,
                quantitySold: qty,
                saleDate: new Date().toISOString()
            };

            const response = await fetch(`${API_BASE}/DailySale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to record sale');
            }

            setQuantity('1');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Record Sale</h2>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Product</label>
                        <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium">
                            {product.name || 'Unknown Product'}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Quantity Sold</label>
                        <input
                            type="number"
                            min="1"
                            max="9999"
                            required
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#4d4dff] focus:outline-none focus:ring-1 focus:ring-[#4d4dff]"
                            placeholder="Enter quantity"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-[#4d4dff] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d3dff] disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Recording...' : 'Record Sale'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}