export const STATUS_TRANSFER = {
  Proposed: 0,
  AutoApproved: 1,
  ManuallyApproved: 2,
  Rejected: 3,
  Shipped: 4,
  Completed: 5,
}

export function getAuthToken() {
  try {
    const stored = window.localStorage.getItem('redistribuix_auth')
    const parsed = stored ? JSON.parse(stored) : null
    return parsed?.token ?? null
  } catch {
    return null
  }
}

export function buildAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function buildTransferBody(transfer, overrides) {
  return {
    transferBatchId: transfer.transferBatchId,
    sourceLocationId: transfer.sourceLocation?.locationId ?? transfer.sourceLocationId,
    destinationLocationId: transfer.destinationLocation?.locationId ?? transfer.destinationLocationId,
    logisticCostTotal: transfer.logisticCostTotal ?? 0,
    totalSaleValue: transfer.totalSaleValue ?? 0,
    transferScore: transfer.transferScore ?? 0,
    recommendedBySystemAt: transfer.recommendedBySystemAt ?? new Date().toISOString(),
    ...overrides,
  }
}