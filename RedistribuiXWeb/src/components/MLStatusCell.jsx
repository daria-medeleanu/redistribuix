import { getMLStatusConfig } from '../utils/MLStatusConfig'

export default function MLStatusCell({ item, isLoading, onTestML }) {
    const config = getMLStatusConfig(item.mlStatus)
    const tooltip = item.mlStatus ? `${config.tooltip}${item.mlForecast != null ? `\n\nForecast 100 days: ${item.mlForecast} units\nDaily sales rate: ${item.mlDailyRate?.toFixed(2)}/day\nML days of stock: ${item.mlDaysOfStock?.toFixed(1)} days` : ''}` : ''

    if (item.mlStatus) {
        return (
            <div className="flex flex-col items-center gap-1.5">
                <span 
                    className={config.classes}
                    title={tooltip}
                >
                    {config.label}
                </span>
                {item.mlForecast != null && (
                    <div className="text-[13px] text-slate-500 space-y-0.5">
                        <div>📊 Forecast 100d: <span className="font-medium text-slate-700">{item.mlForecast} units</span></div>
                        <div>📈 Daily: <span className="font-medium text-slate-700">{item.mlDailyRate?.toFixed(2)}/day</span></div>
                    </div>
                )}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="inline-flex items-center gap-2 text-slate-500">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs">Testing...</span>
            </div>
        )
    }

    return (
        <button
            onClick={onTestML}
            className="inline-flex items-center gap-2 rounded-md bg-[#4d4dff] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-[#3d3dff] hover:scale-105"
        >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Test ML
        </button>
    )
}
