import ConfirmationModal from './ConfirmationModal'

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

function TransferActionButtons({
  transfer,
  actionLoading,
  actionResult,
  rejectingId,
  denialReason,
  setDenialReason,
  onApprove,
  onReject,
  onToggleReject,
  onCancelReject,
}) {
  const id = transfer.transferBatchId
  const isLoading = actionLoading === id
  const result = actionResult[id]
  const isRejecting = rejectingId === id

  if (result === 'approved') {
    return (
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
        <span>✓</span> Approved
      </div>
    )
  }

  if (result === 'rejected') {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
        <span>✕</span> Rejected
      </div>
    )
  }

  if (result === 'error') {
    return <div className="text-red-400 text-xs">⚠️ Something went wrong.</div>
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onApprove(transfer)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? <SpinnerIcon /> : '✓'} Approve
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onToggleReject(id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✕ Reject
        </button>
      </div>

      {isRejecting && (
        <ConfirmationModal
          isOpen={isRejecting}
          title="Reject transfer"
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={async () => onReject(transfer)}
          onCancel={onCancelReject}
          isDangerous
        >
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-red-400">
              Denial reason (optional)
            </label>
            <input
              type="text"
              value={denialReason}
              onChange={e => setDenialReason(e.target.value)}
              placeholder="e.g. No transport available"
              className="h-9 w-full rounded-lg border border-red-200 bg-white px-2 text-xs focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-300"
            />
          </div>
        </ConfirmationModal>
      )}
    </div>
  )
}

export default TransferActionButtons