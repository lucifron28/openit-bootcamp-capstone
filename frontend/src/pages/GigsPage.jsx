import { useMemo, useState } from 'react'
import GigForm from '../features/gigs/GigForm'
import GigList from '../features/gigs/GigList'
import GigTabs from '../features/gigs/GigTabs'
import { useAuth } from '../hooks/useAuth'
import {
  useCreateGigPost,
  useDeleteGigPost,
  useGigPost,
  useGigPosts,
  useUpdateGigPost,
} from '../hooks/useGigPosts'

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function formatStatus(status) {
  const labels = {
    0: 'Open',
    1: 'In progress',
    2: 'Completed',
    OPEN: 'Open',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'Completed',
  }

  return labels[status] || 'Open'
}

function GigsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('browse')
  const [selectedGigPostId, setSelectedGigPostId] = useState(null)
  const [editingPost, setEditingPost] = useState(null)
  const [editValues, setEditValues] = useState({ title: '', description: '' })
  const gigPostsQuery = useGigPosts()
  const selectedGigPostQuery = useGigPost(selectedGigPostId)
  const createMutation = useCreateGigPost()
  const updateMutation = useUpdateGigPost()
  const deleteMutation = useDeleteGigPost()

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

  const startEditingPost = (post) => {
    setEditingPost(post)
    setEditValues({
      title: post.title,
      description: post.description,
    })
  }

  const handleUpdatePost = (event) => {
    event.preventDefault()

    if (!editingPost || !editValues.title.trim() || !editValues.description.trim()) {
      return
    }

    updateMutation.mutate(
      {
        gigPostId: editingPost.id,
        payload: {
          title: editValues.title.trim(),
          description: editValues.description.trim(),
        },
      },
      {
        onSuccess: () => {
          setEditingPost(null)
          setEditValues({ title: '', description: '' })
        },
      },
    )
  }

  const handleDeletePost = (post) => {
    const shouldDelete = window.confirm(`Delete "${post.title}"?`)

    if (shouldDelete) {
      deleteMutation.mutate(post.id)
    }
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
                onView={setSelectedGigPostId}
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
              {updateMutation.isError && (
                <div className="alert alert-error">
                  <span>Could not update gig post.</span>
                </div>
              )}
              {deleteMutation.isError && (
                <div className="alert alert-error">
                  <span>Could not delete gig post.</span>
                </div>
              )}
              {editingPost && (
                <form className="rounded-box border border-base-300 bg-base-200 p-4" onSubmit={handleUpdatePost}>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-semibold">Edit gig post</h3>
                      <p className="text-sm text-base-content/70">Only title and description are supported by the backend right now.</p>
                    </div>
                    <label className="form-control">
                      <span className="label-text mb-1">Title</span>
                      <input
                        className="input input-bordered"
                        value={editValues.title}
                        onChange={(event) =>
                          setEditValues((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text mb-1">Description</span>
                      <textarea
                        className="textarea textarea-bordered min-h-24"
                        value={editValues.description}
                        onChange={(event) =>
                          setEditValues((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setEditingPost(null)}
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
              <GigList
                deletingId={deleteMutation.variables}
                emptyMessage="No gig posts yet."
                onDelete={handleDeletePost}
                onEdit={startEditingPost}
                onView={setSelectedGigPostId}
                posts={myPostedGigs}
                showManageActions
              />
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

        {selectedGigPostId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/70 p-4">
            <article className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-base-300 bg-base-100 shadow-xl">
              <div className="card-body gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase text-primary">Gig post</p>
                    <h2 className="card-title mt-1">
                      {selectedGigPostQuery.data?.title || 'Loading gig post...'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSelectedGigPostId(null)}
                  >
                    Close
                  </button>
                </div>

                {selectedGigPostQuery.isLoading && (
                  <span className="loading loading-spinner text-primary" />
                )}
                {selectedGigPostQuery.isError && (
                  <p className="text-sm text-error">Could not load gig post.</p>
                )}
                {selectedGigPostQuery.data && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-primary badge-outline">
                        {formatStatus(selectedGigPostQuery.data.status)}
                      </span>
                      {selectedGigPostQuery.data.createdAt && (
                        <span className="badge badge-outline">
                          {new Date(selectedGigPostQuery.data.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-base-content/80">
                      {selectedGigPostQuery.data.description}
                    </p>
                    <p className="text-sm text-base-content/60">
                      Posted by{' '}
                      {[selectedGigPostQuery.data.firstName, selectedGigPostQuery.data.lastName]
                        .filter(Boolean)
                        .join(' ') || 'SideKick user'}
                    </p>
                    <div className="alert">
                      <span>Applications are pending backend support.</span>
                    </div>
                  </>
                )}
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}

export default GigsPage
