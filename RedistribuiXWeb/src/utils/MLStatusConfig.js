export const getMLStatusConfig = (mlStatus) => {
    if (!mlStatus) {
        return {
            label: 'No Prediction',
            classes: 'inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200 cursor-help',
            tooltip: 'ML prediction unavailable. Insufficient historical data or product too new to generate accurate forecast.'
        }
    }

    const statusMap = {
        'STOCKOUT_RISK': {
            label: 'Stockout Risk',
            classes: 'inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700 ring-2 ring-inset ring-red-600/20 cursor-help shadow-sm',
            tooltip: 'CRITICAL: High risk of running out of stock within predicted timeframe. Immediate restocking or transfer recommended to prevent lost sales.'
        },
        'LOW_STOCK': {
            label: 'Low Stock',
            classes: 'inline-flex items-center rounded-md bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700 ring-2 ring-inset ring-orange-600/30 cursor-help shadow-sm',
            tooltip: 'Stock levels below optimal threshold. Plan restocking within 1-2 weeks. Monitor daily sales to prevent stockout.'
        },
        'MODERATE_STOCK': {
            label: 'Moderate',
            classes: 'inline-flex items-center rounded-md bg-yellow-50 px-3 py-1.5 text-sm font-bold text-yellow-700 ring-2 ring-inset ring-yellow-600/30 cursor-help shadow-sm',
            tooltip: 'Stock at acceptable levels. Sales are predictable. Continue current replenishment strategy with weekly monitoring.'
        },
        'HEALTHY': {
            label: 'HEALTHY',
            classes: 'inline-flex items-center rounded-md bg-green-50 px-3 py-1.5 text-sm font-bold text-green-700 ring-2 ring-inset ring-green-600/30 cursor-help shadow-sm',
            tooltip: 'OPTIMAL STATUS: Stock perfectly balanced with predicted demand over 100 days. Current inventory sufficient to cover forecasted sales without excess. No action required - maintain current strategy.'
        },
        'OVERSTOCKED': {
            label: 'Overstocked',
            classes: 'inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700 ring-2 ring-inset ring-blue-600/30 cursor-help shadow-sm',
            tooltip: 'Stock exceeds predicted demand. Capital inefficiently allocated. Consider redistribution to higher-demand locations or promotional pricing.'
        },
        'DEAD_STOCK': {
            label: 'DEAD STOCK',
            classes: 'inline-flex items-center rounded-md bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-700 ring-2 ring-inset ring-purple-600/30 cursor-help shadow-sm',
            tooltip: 'CRITICAL: Product not selling - near-zero predicted demand over 100 days. Stock will remain idle, tying up capital. URGENT ACTIONS: Apply aggressive discounts (30-50%), transfer to other locations, bundle with popular items, or discontinue. DO NOT reorder.'
        },
        'ERROR': {
            label: 'Error',
            classes: 'inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-bold text-red-500 ring-2 ring-inset ring-red-300 cursor-help shadow-sm',
            tooltip: 'Prediction failed. Causes: Insufficient historical data (minimum 30 days required), technical API error, or product too new. Retry in a few days after more sales data accumulates.'
        }
    }

    return statusMap[mlStatus] || {
        label: mlStatus,
        classes: 'inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-300 cursor-help',
        tooltip: `Unknown ML status: ${mlStatus}`
    }
}
