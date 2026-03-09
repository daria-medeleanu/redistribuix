import screenProtectorIcon from '../assets/icons/screen_protector.png'
import phoneCaseIcon from '../assets/icons/phone_case.png'
import chargerIcon from '../assets/icons/phone-charger.png'
import cableIcon from '../assets/icons/usb.png'
import boxIcon from '../assets/icons/box.png'
import { formatLabel } from '../utils/productHelpers'

const CATEGORY_ICONS = {
  ScreenProtector: screenProtectorIcon,
  PhoneCase: phoneCaseIcon,
  Charger: chargerIcon,
  Cable: cableIcon,
  All: boxIcon,
}

function getCategoryIcon(name) {
  return CATEGORY_ICONS[name] ?? boxIcon
}

function CategoryCard({ name, count, active, onClick }) {
  const isAll = name === 'All'
  const label = isAll ? 'All products' : formatLabel(name)
  const icon = getCategoryIcon(name)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col items-center justify-center gap-2
        h-48 w-48 md:h-48 md:w-48 rounded-full border bg-white shadow-sm
        transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4d4dff]/50 cursor-pointer
        ${active
          ? 'border-[#4d4dff] shadow-lg scale-105 bg-slate-50'
          : 'border-slate-200 hover:border-[#4d4dff] hover:shadow-lg hover:scale-105'
        }
      `}
    >
      {active && (
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#4d4dff]" />
      )}

      <div
        className={`flex items-center justify-center w-18 h-18 rounded-full bg-slate-50 overflow-hidden transition-transform duration-200 ${
          active ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <img src={icon} alt={label} className="w-14 h-14 object-contain" />
      </div>

      <span
        className={`text-xs font-semibold leading-tight text-center whitespace-nowrap
          ${active ? 'text-[#111827]' : 'text-[#4b5563]'}`}
      >
        {label}
      </span>

      {count > 0 && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full leading-none
            ${active ? 'bg-[#4d4dff] text-white' : 'bg-[#dbdbff] text-[#4d4dff]'}`}
        >
          {count} types
        </span>
      )}
    </button>
  )
}

export default CategoryCard