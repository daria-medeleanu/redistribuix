import DashboardNavbar from '../components/NavBar'
import RadialDots from '../components/LogoAnimation'
function DashboardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      <DashboardNavbar />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            RedistribuiX
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Intelligent stock optimization system for multi-location retail networks
          </p>
        </div>
        {/* <RadialDots/> */}
        {/* About Section */}
        <section id="about" className="rounded-3xl border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 p-8 shadow-lg sm:p-12">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">What RedistribuiX Does</h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                RedistribuiX is an intelligent analysis and recommendation system for a network of <span className="font-semibold text-gray-900">5 retail kiosks</span> selling 
                phone cases and mobile accessories in shopping malls nationwide. The system analyzes inventory across all locations and identifies 
                opportunities to redistribute stock between kiosks for maximum profitability.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                Using data from physical inventories performed every <span className="font-semibold text-gray-900">~100 days</span>, RedistribuiX detects where products 
                are stagnating (dead stock) and where similar products are selling fast (stockouts). It then calculates whether moving 
                inventory between locations is profitable, considering all costs (transportation, packaging, handling) and market factors 
                (demographics, seasonality, phone launches, local demand patterns).
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                The system provides prioritized recommendations for <span className="font-semibold text-gray-900">profitable redistributions</span>, helping transform 
                idle capital into active sales while preventing missed opportunities at high-demand locations.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="rounded-3xl border border-blue-200 bg-white p-8 shadow-lg sm:p-12">
          <h2 className="text-center text-3xl font-bold text-gray-900">Key Features</h2>
          <p className="mt-2 text-center text-gray-600">
            The system analyzes multiple dimensions to provide intelligent recommendations
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-6 transition hover:shadow-lg">
              <div className="rounded-lg bg-blue-600 p-3 w-fit">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Stock Performance Analysis</h3>
              <p className="mt-2 text-sm text-gray-700">
                Identifies problematic products: dead stock, stockouts, slow-moving inventory. 
                Real-time monitoring of each product's performance at every location.
              </p>
            </article>

            <article className="rounded-2xl border-2 border-purple-100 bg-purple-50 p-6 transition hover:shadow-lg">
              <div className="rounded-lg bg-purple-600 p-3 w-fit">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Cost-Benefit Analysis</h3>
              <p className="mt-2 text-sm text-gray-700">
                Automatically evaluates whether a redistribution is profitable: transportation, packaging, handling costs 
                vs. sales potential and profit margin.
              </p>
            </article>

            <article className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-6 transition hover:shadow-lg">
              <div className="rounded-lg bg-indigo-600 p-3 w-fit">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Multi-Location Analysis</h3>
              <p className="mt-2 text-sm text-gray-700">
                Monitors performance across all 5 locations: local demographics, purchasing power, 
                mall foot traffic, specific consumer behavior.
              </p>
            </article>

            <article className="rounded-2xl border-2 border-amber-100 bg-amber-50 p-6 transition hover:shadow-lg">
              <div className="rounded-lg bg-amber-600 p-3 w-fit">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Seasonal Factors &amp; Events</h3>
              <p className="mt-2 text-sm text-gray-700">
                Takes into account Black Friday, new phone launches, academic holidays, tourist seasons. 
                Predicts the impact on demand and logistics.
              </p>
            </article>

            <article className="rounded-2xl border-2 border-teal-100 bg-teal-50 p-6 transition hover:shadow-lg">
              <div className="rounded-lg bg-teal-600 p-3 w-fit">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Historical Sales Velocity</h3>
              <p className="mt-2 text-sm text-gray-700">
                Analyzes sales history to predict future demand. Calculates how many days it will take 
                to sell redistributed stock at the destination location.
              </p>
            </article>

            <article className="rounded-2xl border-2 border-rose-100 bg-rose-50 p-6 transition hover:shadow-lg">
              <div className="rounded-lg bg-rose-600 p-3 w-fit">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">Intelligent Recommendations</h3>
              <p className="mt-2 text-sm text-gray-700">
                Automatically generates a list of recommended redistributions, prioritized by profitability. 
                Includes confidence level and risk factors for each recommendation.
              </p>
            </article>
          </div>
        </section>

        {/* Constraints Considered */}
        <section id="constraints" className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:p-12">
          <h2 className="text-center text-3xl font-bold text-gray-900">Constraints Considered</h2>
          
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Internal Factors */}
            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-600 p-2">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-900">Internal Factors (Financial/Logistics)</h3>
              </div>
              
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Transportation costs</p>
                    <p className="text-sm text-gray-700">Calculates distance between locations and cost per kilometer</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Packaging and handling costs</p>
                    <p className="text-sm text-gray-700">Includes materials and time required for package preparation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Profit margin</p>
                    <p className="text-sm text-gray-700">Validates that redistribution is worthwhile: profit &gt; total costs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Historical sales velocity</p>
                    <p className="text-sm text-gray-700">Estimates how long sales will take at the destination location</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* External Factors */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-600 p-2">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-900">External Factors (Market)</h3>
              </div>
              
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Demographics and purchasing power</p>
                    <p className="text-sm text-gray-700">Specific to each mall - Bucharest premium vs. smaller cities</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Smartphone launches</p>
                    <p className="text-sm text-gray-700">iPhone 16, Samsung S25 - reduces value of products for older models</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Holiday and event calendar</p>
                    <p className="text-sm text-gray-700">Black Friday (busy couriers), holidays (university cities empty)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">Tourist seasonality</p>
                    <p className="text-sm text-gray-700">Brașov in summer (tourists) vs. Cluj in summer (students away)</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="rounded-3xl border border-green-300 bg-linear-to-r from-green-100 to-emerald-100 p-8 shadow-lg sm:p-12">
          <h2 className="text-center text-3xl font-bold text-gray-900">Benefits</h2>
          
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-fit rounded-full bg-green-600 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Increase Profitability</h3>
              <p className="mt-2 text-sm text-gray-700">
                Transform dead stock into active sales and eliminate missed opportunities
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-fit rounded-full bg-green-600 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Optimize Capital</h3>
              <p className="mt-2 text-sm text-gray-700">
                Free up capital locked in slow-moving products
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-fit rounded-full bg-green-600 p-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Data-Driven Decisions</h3>
              <p className="mt-2 text-sm text-gray-700">
                Recommendations based on real data, not intuition
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default DashboardPage