import { useEffect, useState } from 'react'
import {
  STATUS_TRANSFER,
  getAuthToken,
  buildAuthHeaders,
  buildTransferBody,
} from '../utils/transferHelpers'

const API_BASE = 'http://localhost:5056/api/v1'

export function useSuggestedTransfers() {
function getAuthUser() {
  try {
    const authString = 
      window.localStorage.getItem('redistribuix_auth') || 
      window.localStorage.getItem('user') || 
      window.localStorage.getItem('userData');
      
    if (!authString) return null;

    const userData = JSON.parse(authString);
    
    return userData.user ? userData.user : userData;
  } catch (err) {
    console.error('Failed to parse auth data:', err);
    return null;
  }
}
export function useSuggestedTransfers(status = 2, includeActions = true) {
  const [transfers, setTransfers] = useState([])
  const [manuallyApproved, setManuallyApproved] = useState([])
  const [productsList, setProductsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [denialReason, setDenialReason] = useState('')
  const [actionResult, setActionResult] = useState({})
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        console.log(`[useSuggestedTransfers] Fetching transfers with status: ${status}`);
        setIsLoading(true)
        setHasError(false)

        const token = getAuthToken()
        const authHeaders = buildAuthHeaders(token)
        const user = getAuthUser()
        const isStandManager = user?.role === 'StandManager' || user?.locationId
        setUserRole(user?.role || (user?.locationId ? 'StandManager' : 'Admin'))

        let transferRes;
        if (isStandManager && user?.locationId) {
          // Stand managers fetch their location's transfers by status
          const apiUrl = `http://localhost:5056/api/v1/TransferBatch/location/${user.locationId}/status/${status}`;
          console.log('[Stand Manager] Fetching transfers:', apiUrl);
          transferRes = await fetch(apiUrl, {
            method: 'GET',
            headers: authHeaders,
          });
        } else {
          // Admins: for status 2 (ManuallyApproved) use generate-recommendations, otherwise fetch by status
          if (status === 2) {
            const apiUrl = 'http://localhost:5056/api/v1/TransferBatch/generate-recommendations';
            console.log('[Admin] Generating transfer recommendations:', apiUrl);
            transferRes = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...authHeaders },
              body: JSON.stringify({}),
            });
          } else {
            const apiUrl = `http://localhost:5056/api/v1/TransferBatch/status/${status}`;
            console.log('[Admin] Fetching transfers by status:', apiUrl);
            transferRes = await fetch(apiUrl, {
              method: 'GET',
              headers: authHeaders,
            });
          }
        }

        const productsRes = await fetch('/api/v1/Product', { headers: authHeaders });
        
        if (!transferRes.ok || !productsRes.ok) {
          console.error('[API Error] Transfer response:', transferRes.status, 'Products response:', productsRes.status);
          throw new Error('Failed to fetch data');
        }

        const [transferData, productsData] = await Promise.all([
          transferRes.json(),
          productsRes.json(),
        ])
        
        console.log('[API Response] Transfers received:', {
          count: Array.isArray(transferData) ? transferData.length : 0,
          status: status,
          data: transferData
        });
        
        setTransfers(Array.isArray(transferData) ? transferData : [])
        setProductsList(Array.isArray(productsData) ? productsData : [])
<<<<<<< HEAD
        setManuallyApproved(Array.isArray(approvedData) ? approvedData : [])

        setActionResult(prev => {
          const next = { ...prev }
          if (Array.isArray(approvedData)) {
            approvedData.forEach(a => {
              next[a.transferBatchId] = 'approved'
            })
          }
          return next
        })
      } catch {
=======
      } catch (error) {
        console.error('[API Error] Failed to fetch transfers:', error);
>>>>>>> main
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [status])

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

      const res = await fetch(`${API_BASE}/TransferBatch/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(token) },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      setActionResult(prev => ({ ...prev, [id]: 'approved' }))
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

      const res = await fetch(`${API_BASE}/TransferBatch/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(token) },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      setActionResult(prev => ({ ...prev, [id]: 'rejected' }))
      setTransfers(prev =>
        prev.map(t => (t.transferBatchId === id ? { ...t, status: 'Rejected' } : t)),
      )
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

  async function handleComplete(transfer) {
    const id = transfer.transferBatchId
    setActionLoading(id)
    try {
      const token = getAuthToken()
      const body = buildTransferBody(transfer, {
        status: STATUS_TRANSFER.Completed,
        denialReason: null,
        approvedAt: transfer.approvedAt,
      })

      const res = await fetch(`/api/v1/TransferBatch/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(token) },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      setActionResult(prev => ({ ...prev, [id]: 'completed' }))
      setTransfers(prev =>
        prev.map(t => t.transferBatchId === id ? { ...t, status: 'Completed' } : t)
      )
    } catch {
      setActionResult(prev => ({ ...prev, [id]: 'error' }))
    } finally {
      setActionLoading(null)
    }
  }

  return {
    transfers,
    manuallyApproved,
    productsList,
    isLoading,
    hasError,
    userRole,
    ...(includeActions && {
      actionLoading,
      rejectingId,
      denialReason,
      setDenialReason,
      actionResult,
      handleApprove,
      handleReject,
      handleComplete,
      toggleRejectPanel,
      cancelReject,
    }),
  }
}