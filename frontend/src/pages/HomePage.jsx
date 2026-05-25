import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

function HomePage() {
  return (
    <>
      <section
        className="hero min-h-[72svh]"
      >
        <div className="hero-content max-w-5xl px-4 text-left text-neutral-content">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase text-primary-content/80">
              Community gig marketplace
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Find small local jobs or prepare to post work in your community.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-neutral-content/85">
              SideKick helps Filipinos discover short-term gigs, apply for extra income
              opportunities, and organize future gig posts in one simple place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary">
                Create account
              </Link>
              <Link to="/login" className="btn btn-outline border-white text-white hover:bg-white hover:text-neutral">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-100 px-4 py-10">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-box border border-base-300 bg-base-200 p-5">
            <h2 className="text-lg font-semibold">Browse gigs</h2>
            <p className="mt-2 text-sm text-base-content/70">
              {/* todo */}
              Discover local work and apply when gig listings are connected.
            </p>
          </div>
          <div className="rounded-box border border-base-300 bg-base-200 p-5">
            <h2 className="text-lg font-semibold">Post a gig</h2>
            <p className="mt-2 text-sm text-base-content/70">
              {/* todo */}
              Prepare an account for future posting tools after auth is ready.
            </p>
          </div>
          <div className="rounded-box border border-base-300 bg-base-200 p-5">
            <h2 className="text-lg font-semibold">Apply simply</h2>
            <p className="mt-2 text-sm text-base-content/70">
              {/* todo */}
              Keep applications and profile details in one dashboard later.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
