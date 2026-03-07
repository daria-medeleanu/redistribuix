import { useEffect, useState } from 'react'
import {
  STATUS_TRANSFER,
  getAuthToken,
  buildAuthHeaders,
  buildTransferBody,
} from '../utils/transferHelpers'

export function useSuggestedTransfers() {
  const [transfers, setTransfers] = useState([])
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

        const [transferRes, productsRes] = await Promise.all([
          fetch('/api/v1/TransferBatch/generate-recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({}),
          }),
          fetch('/api/v1/Product', { headers: authHeaders }),
        ])

        if (!transferRes.ok || !productsRes.ok) throw new Error('Failed to fetch data')

        const [transferData, productsData] = await Promise.all([
          transferRes.json(),
          productsRes.json(),
        ])

        setTransfers(Array.isArray(transferData) ? transferData : [])
        setProductsList(Array.isArray(productsData) ? productsData : [])
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
      setTransfers(prev =>
        prev.map(t => t.transferBatchId === id ? { ...t, status: 'ManuallyApproved' } : t)
      )
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