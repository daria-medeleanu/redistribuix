import { useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu';

function SuggestedTransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadTransfersAndProducts() {
      try {
        setIsLoading(true);
        setHasError(false);
        const storedAuth = window.localStorage.getItem('redistribuix_auth');
        const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
        const authHeaders = parsedAuth?.token ? { Authorization: `Bearer ${parsedAuth.token}` } : undefined;
        // Fetch transfer batches
        const transferResponse = await fetch('/api/v1/TransferBatch', authHeaders ? { headers: authHeaders } : undefined);
        if (!transferResponse.ok) throw new Error('Failed to fetch transfer batches');
        const transferData = await transferResponse.json();
        setTransfers(Array.isArray(transferData) ? transferData : []);
        // Fetch products list
        const productsResponse = await fetch('/api/v1/Product', authHeaders ? { headers: authHeaders } : undefined);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setProductsList(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadTransfersAndProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#4b5563] flex pl-16">
      <SideMenu activePage="transfers" onNavigate={() => {}} userName="Alexia" onLogout={() => {}} />
      <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto">
        <header className="mb-7 flex flex-col items-center text-center">
          <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[#2e0e04] mb-1">
            Suggested <em className="italic font-light text-[#4d4dff]">transfers</em>
          </h1>
          <p className="text-[0.9rem] text-[#8a5a43] max-w-md">
            View transfer batches recommended by the transport service.
          </p>
        </header>
        {isLoading && (
          <div className="flex items-center gap-3 text-sm text-[#8a5a43] py-4">
            <svg className="w-4 h-4 animate-spin text-[#c0391b]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading transfer batches…
          </div>
        )}
        {hasError && !isLoading && (
          <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 max-w-sm">
            <span className="text-base">⚠️</span>
            Could not load transfer batches. Please try again later.
          </div>
        )}
        {!isLoading && !hasError && (
          <section>
            <div className="flex flex-col gap-4">
              {transfers.length === 0 ? (
                <p className="text-sm text-[#a07060] py-8">No suggested transfers found.</p>
              ) : (
                transfers.map((transfer) => (
                  <div key={transfer.transferBatchId} className="rounded-2xl border border-[#eddccf] bg-white p-5 shadow-md flex flex-row items-center gap-6">
                    {/* Status & Score */}
                    <div className="flex flex-col min-w-[120px] items-start">
                      <div className="text-xs text-[#6b7280] font-semibold mb-1">{transfer.status}</div>
                      <div className="text-xs text-[#4d4dff] font-bold">Score: {transfer.transferScore}</div>
                    </div>
                    {/* Locations */}
                    <div className="flex flex-col min-w-[180px]">
                      <div className="font-bold text-lg text-[#161643]">
                        {transfer.sourceLocation?.name || 'Unknown'}
                        <span className="mx-2">→</span>
                        {transfer.destinationLocation?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-[#b07050] mt-1">Cost: {transfer.logisticCostTotal} RON | Value: {transfer.totalSaleValue} RON</div>
                    </div>
                    {/* Products */}
                    <div className="flex-1">
                      <span className="font-semibold text-sm">Products:</span>
                      <ul className="ml-4 list-disc">
                        {transfer.products && transfer.products.length > 0 ? (
                          transfer.products.map((p, idx) => {
                            const prod = productsList.find(prod => prod.productId === p.productId);
                            return (
                              <li key={p.productId + '-' + idx} className="text-xs">
                                {prod ? prod.name : 'Unknown product'} × {p.quantity}
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-xs">No products listed</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default SuggestedTransfersPage;
