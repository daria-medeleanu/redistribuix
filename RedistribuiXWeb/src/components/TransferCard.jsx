import TransferActionButtons from './TransferActionButtons'

const STATUS_MAP = {
  0: 'Proposed',
  1: 'AutoApproved',
  2: 'ManuallyApproved',
  3: 'Rejected',
  4: 'Shipped',
  5: 'Completed',
}

function getStatusText(status) {
  if (typeof status === 'number') {
    return STATUS_MAP[status] || 'Unknown'
  }
  return status || 'Suggested'
}

function StatusBadge({ status }) {
  const statusText = getStatusText(status)
  const styles =
    statusText === 'Pending'
      ? 'bg-amber-50 text-amber-600 border-amber-200'
      : statusText === 'Completed'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
      : statusText === 'ManuallyApproved'
      ? 'bg-blue-50 text-blue-600 border-blue-200'
      : statusText === 'Rejected'
      ? 'bg-red-50 text-red-600 border-red-200'
      : 'bg-[#eef0ff] text-[#4d4dff] border-[#c7c7ff]'

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statusText}
    </span>
  )
}

function StatPill({ label, value, highlight }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border ${
      highlight
        ? 'bg-[#eef0ff] border-[#c7c7ff]'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <span className={`text-[10px] uppercase tracking-widest font-semibold ${highlight ? 'text-[#4d4dff]' : 'text-slate-400'}`}>
        {label}
      </span>
      <span className={`text-[0.95rem] font-bold tabular-nums ${highlight ? 'text-[#4d4dff]' : 'text-[#161643]'}`}>
        {value}
      </span>
    </div>
  )
}

function ProductTags({ products, productsList }) {
  if (!products?.length) {
    return <p className="text-sm text-slate-400 italic">No products listed.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((p, idx) => {
        const match = productsList.find(pr => pr.productId === p.productId)
        return (
          <span
            key={`${p.productId}-${idx}`}
            className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[12px] text-[#374151]"
          >
            <span className="font-medium">{match ? match.name : 'Unknown product'}</span>
            <span className="w-px h-3 bg-slate-300" />
            <span className="text-[#4d4dff] font-bold">×{p.quantity}</span>
          </span>
        )
      })}
    </div>
  )
}

function TransferCard({
  transfer,
  productsList,
  actionLoading,
  actionResult,
  rejectingId,
  denialReason,
  setDenialReason,
  onApprove,
  onReject,
  onComplete,
  onToggleReject,
  onCancelReject,
  userRole,
}) {
  return (
    <article className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-[#a6a6ff]">
      <div className="h-1 w-full bg-linear-to-r from-[#4d4dff] via-[#a6a6ff] to-[#dbdbff]" />

      <div className="p-6 flex flex-col gap-5">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-[#111827]">
            <span className="font-bold text-[1.05rem]">
              {transfer.sourceLocation?.name || 'Unknown'}
            </span>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#eef0ff] text-[#4d4dff] text-sm font-bold">
              →
            </span>
            <span className="font-bold text-[1.05rem]">
              {transfer.destinationLocation?.name || 'Unknown'}
            </span>
          </div>
          <StatusBadge status={transfer.status} />
        </div>

        <div className="flex flex-wrap gap-3">
          <StatPill
            label="Logistic Cost"
            value={transfer.logisticCostTotal != null ? `${transfer.logisticCostTotal} RON` : '—'}
          />
          <StatPill
            label="Sale Value"
            value={transfer.totalSaleValue != null ? `${transfer.totalSaleValue} RON` : '—'}
            highlight
          />
          {transfer.transferScore != null && (
            <StatPill label="Score" value={transfer.transferScore} highlight />
          )}
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex items-start gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-3">
              Products to transfer
            </p>
            <ProductTags products={transfer.products} productsList={productsList} />
          </div>

          <TransferActionButtons
            transfer={transfer}
            actionLoading={actionLoading}
            actionResult={actionResult}
            rejectingId={rejectingId}
            denialReason={denialReason}
            setDenialReason={setDenialReason}
            onApprove={onApprove}
            onReject={onReject}
            onComplete={onComplete}
            onToggleReject={onToggleReject}
            onCancelReject={onCancelReject}
            userRole={userRole}
          />
        </div>
      </div>
    </article>
  )
}

export default TransferCard