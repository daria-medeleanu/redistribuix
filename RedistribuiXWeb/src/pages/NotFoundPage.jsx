import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] to-[#e5e7eb] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-[120px] font-bold text-[#4d4dff] leading-none">
                404
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">
            Page Not Found
          </h1>
          
          <p className="text-[#6b7280] text-lg max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-6 py-3 bg-[#4d4dff] text-white rounded-lg font-medium hover:bg-[#3d3dff] transition-colors shadow-lg shadow-[#4d4dff]/20"
          >
            Go to Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-white text-[#6b7280] rounded-lg font-medium hover:bg-[#f3f4f6] transition-colors border border-[#e5e7eb]"
          >
            Go Back
          </button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-[#9ca3af]">
            If you believe this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
