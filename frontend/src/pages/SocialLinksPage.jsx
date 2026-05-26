import { useState } from 'react'
import { useCreateMySocialLink, useDeleteMySocialLink, useMySocialLinks } from '../hooks/useSocialLinks'

function SocialLinksPage() {
  const [name, setName] = useState('')
  const [href, setHref] = useState('')
  const socialLinksQuery = useMySocialLinks()
  const createMutation = useCreateMySocialLink()
  const deleteMutation = useDeleteMySocialLink()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!name.trim() || !href.trim()) {
      return
    }

    createMutation.mutate(
      {
        name: name.trim(),
        href: href.trim(),
      },
      {
        onSuccess: () => {
          setName('')
          setHref('')
        },
      },
    )
  }

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Profile</p>
          <h1 className="mt-2 text-3xl font-bold">Social links</h1>
        </div>

        <form className="card border border-base-300 bg-base-100 shadow-sm" onSubmit={handleSubmit}>
          <div className="card-body gap-4 md:grid md:grid-cols-[0.7fr_1fr_auto] md:items-end">
            <label className="form-control">
              <span className="label-text mb-1">Name</span>
              <input
                className="input input-bordered"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Facebook"
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1">URL</span>
              <input
                className="input input-bordered"
                value={href}
                onChange={(event) => setHref(event.target.value)}
                placeholder="https://example.com"
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
              Add link
            </button>
          </div>
        </form>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">My links</h2>
            {socialLinksQuery.isLoading && <span className="loading loading-spinner text-primary" />}
            {socialLinksQuery.isError && (
              <p className="text-sm text-base-content/70">
                Social link endpoints are not available yet.
              </p>
            )}
            {socialLinksQuery.data?.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {socialLinksQuery.data.map((link) => (
                  <article
                    key={link.id}
                    className="flex items-center justify-between rounded-box border border-base-300 p-4"
                  >
                    <div>
                      <h3 className="font-semibold">{link.name}</h3>
                      <a className="link link-primary text-sm" href={link.href}>
                        {link.href}
                      </a>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => deleteMutation.mutate(link.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              !socialLinksQuery.isLoading &&
              !socialLinksQuery.isError && <p className="text-sm text-base-content/70">No links yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SocialLinksPage
