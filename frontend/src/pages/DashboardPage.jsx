import { useAuth } from '../hooks/useAuth'

const dashboardItems = [
  {
    title: 'Browse gigs',
    description: '',
  },
  {
    title: 'Post a gig',
    description: '',
  },
  {
    title: 'My applications',
    description: '',
  },
  {
    title: 'My profile',
    description: '',
  },
]

function DashboardPage() {
  const { user } = useAuth()

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase text-primary">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold">Welcome to SideKick</h1>
          <p className="mt-3 text-base-content/70">
            {user?.email ? `Signed in as ${user.email}.` : 'You are signed in.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardItems.map((item) => (
            <article key={item.title} className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-lg">{item.title}</h2>
                <p className="text-sm text-base-content/70">{item.description}</p>
                <div className="card-actions justify-end">
                  <button type="button" className="btn btn-disabled btn-sm">
                    {/* todo */}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
