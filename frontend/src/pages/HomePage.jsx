import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <section className="hero min-h-[72svh] overflow-hidden bg-neutral text-neutral-content">
        <div className="hero-content max-w-5xl px-4 text-left">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase text-neutral-content/80">
              Community gig marketplace
            </p>
            <h1 className="text-4xl font-bold leading-tight">Find small gigs. Earn extra income.</h1>
            <p className="mt-5 max-w-xl text-lg text-neutral-content/85">
              SideKick helps Filipino citizens post local tasks and apply for simple gigs like
              cleaning, errands, tutoring, and basic services.
            </p>
            {isAuthenticated ? (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/gigs" className="btn btn-primary">
                  Browse gigs
                </Link>
                <Link to="/profile" className="btn btn-outline btn-secondary">
                  Complete profile
                </Link>
              </div>
            ) : (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-primary">
                  Create account
                </Link>
                <Link to="/login" className="btn btn-outline btn-secondary">
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-base-100 px-4 py-10">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-box border border-base-300 bg-base-200 p-5">
            <h2 className="text-lg font-semibold">Browse gigs</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Discover nearby work and apply for tasks that fit your time.
            </p>
          </div>
          <div className="rounded-box border border-base-300 bg-base-200 p-5">
            <h2 className="text-lg font-semibold">Post a gig</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Share what you need done and reach people in your community.
            </p>
          </div>
          <div className="rounded-box border border-base-300 bg-base-200 p-5">
            <h2 className="text-lg font-semibold">Apply simply</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Keep applications and profile details organized in a simple workspace.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
