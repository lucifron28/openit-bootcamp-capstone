import { useMemo, useState } from 'react'
import GigForm from '../features/gigs/GigForm'
import GigList from '../features/gigs/GigList'
import { useAuth } from '../hooks/useAuth'
import { useCreateGigPost, useGigPosts } from '../hooks/useGigPosts'

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function GigsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [localGigDetails, setLocalGigDetails] = useState({})
  const gigPostsQuery = useGigPosts()
  const createMutation = useCreateGigPost()

  const gigPosts = useMemo(() => {
    return (gigPostsQuery.data ?? []).map((post) => ({
      ...post,
      ...localGigDetails[post.id],
    }))
  }, [gigPostsQuery.data, localGigDetails])

  const searchTerm = normalize(search)
  const filteredGigPosts = gigPosts.filter((post) => {
    if (!searchTerm) {
      return true
    }

    return [post.title, post.description, post.category, post.location, post.username]
      .map(normalize)
      .some((value) => value.includes(searchTerm))
  })

  const currentUsername = normalize(user?.email || user?.username || user?.userName)
  const myPostedGigs = currentUsername
    ? gigPosts.filter((post) => normalize(post.username) === currentUsername)
    : []
  const myApplications = []

  const handleCreateGig = (values, reset) => {
    createMutation.mutate(
      {
        title: values.title,
        description: values.description,
      },
      {
        onSuccess: (createdGig) => {
          if (createdGig?.id) {
            setLocalGigDetails((current) => ({
              ...current,
              [createdGig.id]: {
                category: values.category,
                location: values.location,
                budget: values.budget,
              },
            }))
          }

          reset()
        },
      },
    )
  }

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Gigs</p>
          <h1 className="mt-2 text-3xl font-bold">Gig posts</h1>
          <p className="mt-3 max-w-2xl text-base-content/70">
            Browse gig listings, post small community tasks, and keep your gig activity in one
            place.
          </p>
        </div>

        <article id="browse" className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="card-title">Browse gigs</h2>
                <p className="text-sm text-base-content/70">Find open community work.</p>
              </div>
              <label className="form-control w-full md:max-w-xs">
                <span className="label-text mb-1">Search</span>
                <input
                  className="input input-bordered"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, location, or poster"
                />
              </label>
            </div>

            <GigList
              emptyMessage="No gigs posted yet."
              isError={gigPostsQuery.isError}
              isLoading={gigPostsQuery.isLoading}
              posts={filteredGigPosts}
              showApplyButton
            />
          </div>
        </article>

        <div id="post" className="scroll-mt-24">
          {createMutation.isError && (
            <div className="alert alert-error mb-4">
              <span>Could not post gig. Please check the details and try again.</span>
            </div>
          )}
          <GigForm isSubmitting={createMutation.isPending} onSubmit={handleCreateGig} />
        </div>

        <article id="posted" className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title">My posted gigs</h2>
              <p className="text-sm text-base-content/70">Gig posts created by your account.</p>
            </div>
            <GigList emptyMessage="No gigs posted yet." posts={myPostedGigs} />
          </div>
        </article>

        <article id="applications" className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title">My applications</h2>
              <p className="text-sm text-base-content/70">
                Track the gigs you apply to as your activity grows.
              </p>
            </div>

            {myApplications.length > 0 ? (
              <GigList emptyMessage="No applications yet." posts={myApplications} />
            ) : (
              <p className="text-sm text-base-content/70">No applications yet.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

export default GigsPage
