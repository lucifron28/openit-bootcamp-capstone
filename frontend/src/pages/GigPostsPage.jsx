import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreateGigPost, useGigPosts } from '../hooks/useGigPosts'

function GigPostsPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const gigPostsQuery = useGigPosts()
  const createMutation = useCreateGigPost()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      return
    }

    createMutation.mutate(
      {
        title: title.trim(),
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
        },
      },
    )
  }

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Gigs</p>
          <h1 className="mt-2 text-3xl font-bold">Gig posts</h1>
        </div>

        <form className="card border border-base-300 bg-base-100 shadow-sm" onSubmit={handleSubmit}>
          <div className="card-body gap-4">
            <label className="form-control">
              <span className="label-text mb-1">Title</span>
              <input
                className="input input-bordered"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Help move boxes"
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">Description</span>
              <textarea
                className="textarea textarea-bordered min-h-28"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the task"
              />
            </label>
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                Post gig
              </button>
            </div>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {gigPostsQuery.isLoading && <span className="loading loading-spinner text-primary" />}
          {gigPostsQuery.isError && <p className="text-sm text-error">Could not load gigs.</p>}
          {gigPostsQuery.data?.map((gigPost) => (
            <article key={gigPost.id} className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title">{gigPost.title}</h2>
                <p className="line-clamp-3 text-sm text-base-content/70">{gigPost.description}</p>
                <p className="text-xs text-base-content/50">
                  Posted by {[gigPost.firstName, gigPost.lastName].filter(Boolean).join(' ') || 'SideKick user'}
                </p>
                <div className="card-actions justify-end">
                  <Link to={`/gigs/${gigPost.id}`} className="btn btn-outline btn-sm">
                    View
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

export default GigPostsPage
