import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const dashboardItems = [
  {
    title: 'Browse gigs',
    description: 'See available gig listings from the community.',
    to: '/gigs#browse',
  },
  {
    title: 'Post a gig',
    description: 'Create a new gig post for work you need done.',
    to: '/gigs#post',
  },
  {
    title: 'My applications',
    description: 'Track the gigs you applied to.',
    to: '/gigs#applications',
  },
  {
    title: 'My profile',
    description: 'Review your account details, contact links, and skills.',
    to: '/profile',
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
                  <Link to={item.to} className="btn btn-primary btn-sm">
                    Open
                  </Link>
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
