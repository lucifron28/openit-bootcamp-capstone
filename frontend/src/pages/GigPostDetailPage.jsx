import { Link, useParams } from 'react-router-dom'
import { useGigPost } from '../hooks/useGigPosts'

function GigPostDetailPage() {
  const { gigPostId } = useParams()
  const gigPostQuery = useGigPost(Number(gigPostId))

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/gigs" className="btn btn-ghost btn-sm">
          Back to gigs
        </Link>

        {gigPostQuery.isLoading && <span className="loading loading-spinner text-primary" />}
        {gigPostQuery.isError && <p className="text-sm text-error">Could not load gig post.</p>}
        {gigPostQuery.data && (
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <p className="text-sm font-semibold uppercase text-primary">Gig post</p>
              <h1 className="text-3xl font-bold">{gigPostQuery.data.title}</h1>
              <p className="whitespace-pre-wrap text-base-content/80">
                {gigPostQuery.data.description}
              </p>
              <p className="text-sm text-base-content/60">
                Posted by{' '}
                {[gigPostQuery.data.firstName, gigPostQuery.data.lastName].filter(Boolean).join(' ') ||
                  'SideKick user'}
              </p>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}

export default GigPostDetailPage
