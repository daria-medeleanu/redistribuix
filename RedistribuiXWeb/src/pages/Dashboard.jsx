import { useState } from 'react'
import DashboardNavbar from '../components/NavBar'

const seedNotes = [
  {
    id: crypto.randomUUID(),
    title: 'Meeting ideas',
    body: 'Outline talking points for Thursday stand-up.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Learning log',
    body: 'Summarize key takeaways from the new API docs.',
  },
]

function DashboardPage() {
  const [notes, setNotes] = useState(seedNotes)
  const [draft, setDraft] = useState({ title: '', body: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setDraft((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!draft.title.trim() && !draft.body.trim()) return
    const nextNote = {
      id: crypto.randomUUID(),
      title: draft.title.trim() || 'Untitled note',
      body: draft.body.trim(),
    }
    setNotes((prev) => [nextNote, ...prev])
    setDraft({ title: '', body: '' })
  }

  return (
    <div className="space-y-10">
      <DashboardNavbar />
        <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 sm:px-8">
            <section className="space-y-8" aria-labelledby="notes-hero">
                <header
                id="notes-hero"
                className="flex flex-col gap-3 border-b border-[#eddccf] pb-6 sm:flex-row sm:items-end sm:justify-between"
                >
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b66532]">Notes app</p>
                    <h1 className="text-3xl font-semibold sm:text-4xl">Capture quick thoughts and action items</h1>
                    <p className="mt-1 text-base text-[#8a5a43]">
                    Draft new notes, pin priorities, and keep everything in one place.
                    </p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#8a5a43]">{notes.length} saved</span>
                </header>

                <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <div className="rounded-2xl border border-[#eddccf] bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">New note</h2>
                    <p className="mb-5 mt-1 text-sm text-[#8a5a43]">Add details below and hit save.</p>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="text-sm font-medium">
                        Title
                        <input
                        name="title"
                        value={draft.title}
                        onChange={handleChange}
                        placeholder="e.g. Sprint retro"
                        className="mt-1 w-full rounded-xl border border-[#eddccf] bg-[#fdf9f4] px-4 py-2 text-base placeholder:text-[#c19a82] focus:border-[#fc7701] focus:outline-none"
                        />
                    </label>
                    <label className="text-sm font-medium">
                        Details
                        <textarea
                        name="body"
                        value={draft.body}
                        onChange={handleChange}
                        rows={6}
                        placeholder="What do you need to remember?"
                        className="mt-1 w-full rounded-xl border border-[#eddccf] bg-[#fdf9f4] px-4 py-2 text-base placeholder:text-[#c19a82] focus:border-[#fc7701] focus:outline-none"
                        />
                    </label>
                    <button
                        type="submit"
                        className="rounded-xl bg-[#6161ff] px-4 py-2 font-semibold text-white shadow-md shadow-[#6161ff]/30 transition hover:bg-[#4d4dff] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={!draft.title.trim() && !draft.body.trim()}
                    >
                        Save note
                    </button>
                    </form>
                </div>

                <div className="rounded-2xl border border-[#eddccf] bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Recent notes</h2>
                  <div className="mt-4 max-h-80 space-y-4 overflow-y-auto pr-2">
                    {notes.length === 0 && (
                        <p className="text-sm text-[#8a5a43]">No notes yet. Start by creating one on the left.</p>
                    )}
                    {notes.map((note) => (
                        <article key={note.id} className="rounded-2xl border border-[#f1e1d5] bg-[#fffefd] p-4">
                        <h3 className="text-lg font-semibold">{note.title}</h3>
                        {note.body && <p className="mt-2 text-sm text-[#8a5a43]">{note.body}</p>}
                        </article>
                    ))}
                    </div>
                </div>
                </div>
            </section>

            <section id="features" className="rounded-3xl border border-[#eddccf] bg-white p-6 shadow-sm sm:p-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="lg:w-1/2">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b66532]">Feature</p>
                    <h2 className="text-3xl font-semibold">What keeps teams coming back</h2>
                    <p className="mt-2 text-base text-[#8a5a43]">
                    Each workspace is optimized for speed, clarity, and async handoffs. Pin high-impact notes, share
                    context instantly, and keep initiatives visible.
                    </p>
                </div>
                <div className="grid flex-1 gap-4 md:grid-cols-2">
                    <article className="rounded-2xl border border-[#eddccf] bg-[#fffefd] p-4">
                    <h3 className="text-lg font-semibold">Realtime sync</h3>
                    <p className="mt-2 text-sm text-[#8a5a43]">Stay in lockstep across devices with live updates.</p>
                    </article>
                    <article className="rounded-2xl border border-[#eddccf] bg-[#fffefd] p-4">
                    <h3 className="text-lg font-semibold">Smart tags</h3>
                    <p className="mt-2 text-sm text-[#8a5a43]">Organize notes automatically using AI-powered labels.</p>
                    </article>
                    <article className="rounded-2xl border border-[#eddccf] bg-[#fffefd] p-4 md:col-span-2">
                    <h3 className="text-lg font-semibold">Shareable briefings</h3>
                    <p className="mt-2 text-sm text-[#8a5a43]">Publish curated updates in a single click for stakeholders.</p>
                    </article>
                </div>
                </div>
            </section>

            <section id="discover" className="rounded-3xl border border-[#eddccf] bg-[#fff8f1] p-6 shadow-sm sm:p-10">
                <div className="flex flex-col gap-6 md:flex-row">
                <div className="md:w-1/3">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b66532]">Discover</p>
                    <h2 className="text-3xl font-semibold">Surface inspiration from the community</h2>
                </div>
                <ul className="flex-1 space-y-4 text-sm text-[#8a5a43]">
                    <li className="rounded-2xl border border-[#eddccf] bg-white p-4">
                    Product squads turn sprint recaps into living wikis with inline reactions.
                    </li>
                    <li className="rounded-2xl border border-[#eddccf] bg-white p-4">
                    Research teams cluster insights using tag heatmaps to prioritize experiments.
                    </li>
                    <li className="rounded-2xl border border-[#eddccf] bg-white p-4">
                    Ops leads broadcast concise Monday briefings with auto-generated highlights.
                    </li>
                </ul>
                </div>
            </section>
        </div>
      
    </div>
  )
}

export default DashboardPage