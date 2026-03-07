import { useEffect, useState } from 'react'
import {
  STATUS_TRANSFER,
  getAuthToken,
  buildAuthHeaders,
  buildTransferBody,
} from '../utils/transferHelpers'

export function useSuggestedTransfers() {
  const [transfers, setTransfers] = useState([])
  const [manuallyApproved, setManuallyApproved] = useState([])
  const [productsList, setProductsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [denialReason, setDenialReason] = useState('')
  const [actionResult, setActionResult] = useState({})

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        setHasError(false)

        const token = getAuthToken()
        const authHeaders = buildAuthHeaders(token)

        const [transferRes, productsRes, approvedRes] = await Promise.all([
          fetch('/api/v1/TransferBatch/generate-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({}),
          }),
          fetch('/api/v1/Product', { headers: authHeaders }),
          fetch('/api/v1/TransferBatch/status/ManuallyApproved', { headers: authHeaders }),
        ])

        if (!transferRes.ok || !productsRes.ok) throw new Error('Failed to fetch data')

        const [transferData, productsData, approvedData] = await Promise.all([
          transferRes.json(),
          productsRes.json(),
          approvedRes.json(),
        ])

        setTransfers(Array.isArray(transferData) ? transferData : [])
        setProductsList(Array.isArray(productsData) ? productsData : [])
        setManuallyApproved(Array.isArray(approvedData) ? approvedData : [])

        // mark approved results as approved in actionResult so UI shows them as approved
        setActionResult(prev => {
          const next = { ...prev }
          if (Array.isArray(approvedData)) {
            approvedData.forEach(a => { next[a.transferBatchId] = 'approved' })
          }
          return next
        })
      } catch {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  async function handleApprove(transfer) {
    const id = transfer.transferBatchId
    setActionLoading(id)
    try {
      const token = getAuthToken()
      const body = buildTransferBody(transfer, {
        status: STATUS_TRANSFER.ManuallyApproved,
        denialReason: null,
        approvedAt: new Date().toISOString(),
      })

      const res = await fetch(`/api/v1/TransferBatch/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(token) },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      setActionResult(prev => ({ ...prev, [id]: 'approved' }))
      // remove from recommendations list and add to manually approved list
      setTransfers(prev => prev.filter(t => t.transferBatchId !== id))
      setManuallyApproved(prev => [{ ...transfer, status: 'ManuallyApproved' }, ...prev])
    } catch {
      setActionResult(prev => ({ ...prev, [id]: 'error' }))
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(transfer) {
    const id = transfer.transferBatchId
    setActionLoading(id)
    try {
      const token = getAuthToken()
      const body = buildTransferBody(transfer, {
        status: STATUS_TRANSFER.Rejected,
        denialReason: denialReason || null,
        approvedAt: null,
      })

      const res = await fetch(`/api/v1/TransferBatch/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(token) },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      setActionResult(prev => ({ ...prev, [id]: 'rejected' }))
      setTransfers(prev =>
        prev.map(t => t.transferBatchId === id ? { ...t, status: 'Rejected' } : t)
      )
      // if rejected, also ensure it's not present in manually approved
      setManuallyApproved(prev => prev.filter(t => t.transferBatchId !== id))
      setRejectingId(null)
      setDenialReason('')
    } catch {
      setActionResult(prev => ({ ...prev, [id]: 'error' }))
    } finally {
      setActionLoading(null)
    }
  }

  function toggleRejectPanel(id) {
    setRejectingId(prev => (prev === id ? null : id))
    setDenialReason('')
  }

  function cancelReject() {
    setRejectingId(null)
    setDenialReason('')
  }

  return {
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
    handleApprove,
    handleReject,
    toggleRejectPanel,
    cancelReject,
  }
}