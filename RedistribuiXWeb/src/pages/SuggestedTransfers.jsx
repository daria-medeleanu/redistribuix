import { useNavigate } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import TransferCard from '../components/TransferCard'
import { useSuggestedTransfers } from '../hooks/UseSuggestedTransfers'

function SuggestedTransfersPage() {
  const navigate = useNavigate()
  const {
    transfers,
    manuallyApproved,
    productsList,
    isLoading,
    hasError,
    actionLoading,
    rejectingId,
    denialReason,
    setDenialReason,
    actionResult,
    userRole,
    handleApprove,
    handleReject,
    handleComplete,
    toggleRejectPanel,
    cancelReject,
  } = useSuggestedTransfers()

  const handleLogout = () => {
    window.localStorage.removeItem('redistribuix_auth')
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#4b5563] flex pl-16">
      <SideMenu activePage="suggestedTransfers" onNavigate={() => {}} userName="Alexia" onLogout={handleLogout} />

      <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto">

        <header className="mb-10 flex flex-col items-center text-center">
          <h1 className="font-serif text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-[#111827] mb-1">
            Suggested{' '}
            <em className="italic font-light text-[#4d4dff]">transfers</em>
          </h1>
          <p className="text-[0.9rem] text-[#6b7280] max-w-md">
            Transfer batches recommended by the system to optimize stock distribution across locations.
          </p>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 text-sm text-[#6b7280] py-16">
            <svg className="w-5 h-5 animate-spin text-[#4d4dff]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading transfer recommendations…
          </div>
        )}

        {hasError && !isLoading && (
          <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 max-w-sm mx-auto">
            <span className="text-base">⚠️</span>
            Could not load transfer batches. Please try again later.
          </div>
        )}

        {!isLoading && !hasError && (
          <section className="mx-auto w-full max-w-5xl">

            {transfers.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#3e3e8a]">
                  {transfers.length} recommendation{transfers.length !== 1 ? 's' : ''}
                </span>
                <div className="flex-1 h-px bg-linear-to-r from-[#a6a6ff] to-transparent" />
              </div>
            )}

            {transfers?.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col gap-5">
                {transfers.map((transfer, index) => (
                  <TransferCard
                    key={transfer.transferBatchId ?? index}
                    transfer={transfer}
                    productsList={productsList}
                    actionLoading={actionLoading}
                    actionResult={actionResult}
                    rejectingId={rejectingId}
                    denialReason={denialReason}
                    setDenialReason={setDenialReason}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onComplete={handleComplete}
                    onToggleReject={toggleRejectPanel}
                    onCancelReject={cancelReject}
                    userRole={userRole}
                  />
                ))}

                {manuallyApproved?.length > 0 && (
                  <>
                    <div className="flex items-center gap-4 mt-6 mb-4">
                      <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#3e3e8a]">
                        {manuallyApproved.length} approved
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#a6a6ff] to-transparent" />
                    </div>
                    <div className="flex flex-col gap-5">
                      {manuallyApproved.map((transfer, index) => (
                        <TransferCard
                          key={transfer.transferBatchId ?? (`ma-` + index)}
                          transfer={transfer}
                          productsList={productsList}
                          actionLoading={actionLoading}
                          actionResult={actionResult}
                          rejectingId={rejectingId}
                          denialReason={denialReason}
                          setDenialReason={setDenialReason}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onToggleReject={toggleRejectPanel}
                          onCancelReject={cancelReject}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-40 select-none">
      <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#4d4dff] flex items-center justify-center text-xl text-[#4d4dff]">
        ✦
      </div>
      <p className="text-sm text-[#3e3e8a]">No suggested transfers found.</p>
    </div>
  )
}

export default SuggestedTransfersPage