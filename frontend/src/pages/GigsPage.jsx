import { useMemo, useState } from 'react'
import GigForm from '../features/gigs/GigForm'
import GigList from '../features/gigs/GigList'
import GigTabs from '../features/gigs/GigTabs'
import { useAuth } from '../hooks/useAuth'
import { useCreateGigPost, useGigPosts } from '../hooks/useGigPosts'

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function GigsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('browse')
  const gigPostsQuery = useGigPosts()
  const createMutation = useCreateGigPost()

  const gigPosts = useMemo(() => {
    return gigPostsQuery.data ?? []
  }, [gigPostsQuery.data])

  const searchTerm = normalize(search)
  const filteredGigPosts = gigPosts.filter((post) => {
    if (!searchTerm) {
      return true
    }

    return [post.title, post.description, post.username, post.firstName, post.lastName]
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
        onSuccess: () => {
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
            Browse gig posts, post small community tasks, and keep your gig activity in one place.
          </p>
        </div>

        <GigTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'browse' && (
          <article id="browse" className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="card-title">Browse gig posts</h2>
                  <p className="text-sm text-base-content/70">Find open community work.</p>
                </div>
                <label className="form-control w-full md:max-w-xs">
                  <span className="label-text mb-1">Search</span>
                  <input
                    className="input input-bordered"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title, description, or poster"
                  />
                </label>
              </div>

              <GigList
                emptyMessage="No gig posts yet."
                isError={gigPostsQuery.isError}
                isLoading={gigPostsQuery.isLoading}
                posts={filteredGigPosts}
                showApplyButton
              />
            </div>
          </article>
        )}

        {activeTab === 'post' && (
          <div id="post" className="scroll-mt-24">
            {createMutation.isError && (
              <div className="alert alert-error mb-4">
                <span>Could not post gig. Please check the details and try again.</span>
              </div>
            )}
            <GigForm isSubmitting={createMutation.isPending} onSubmit={handleCreateGig} />
          </div>
        )}

        {activeTab === 'posts' && (
          <article id="posted" className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4">
              <div>
                <h2 className="card-title">My posted gigs</h2>
                <p className="text-sm text-base-content/70">Gig posts created by your account.</p>
              </div>
              <GigList emptyMessage="No gig posts yet." posts={myPostedGigs} />
            </div>
          </article>
        )}

        {activeTab === 'applications' && (
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
                <div className="alert">
                  <span>No applications yet. This feature is pending backend support.</span>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  )
}

export default GigsPage
