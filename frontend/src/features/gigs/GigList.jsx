function getPosterName(gig) {
  return [gig.firstName, gig.lastName].filter(Boolean).join(' ') || 'SideKick user'
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

function formatBudget(budget) {
  if (budget === undefined || budget === null || Number.isNaN(Number(budget))) {
    return null
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(Number(budget))
}

function GigList({
  deletingId = null,
  emptyMessage,
  errorMessage = 'Could not load gigs.',
  isError = false,
  isLoading = false,
  onDelete,
  onEdit,
  onView,
  posts = [],
  showManageActions = false,
  showApplyButton = false,
}) {
  if (isLoading) {
    return <span className="loading loading-spinner text-primary" />
  }

  if (isError) {
    return <p className="text-sm text-error">{errorMessage}</p>
  }

  if (posts.length === 0) {
    return <p className="text-sm text-base-content/70">{emptyMessage}</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {posts.map((gig) => {
        const budget = formatBudget(gig.budget)

        return (
          <article key={gig.id} className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-3">
              <div>
                <h3 className="card-title text-lg">{gig.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-base-content/70">{gig.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary badge-outline">{formatStatus(gig.status)}</span>
                {gig.category && <span className="badge badge-outline">{gig.category}</span>}
                {gig.location && <span className="badge badge-outline">{gig.location}</span>}
                {budget && <span className="badge badge-primary badge-outline">{budget}</span>}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-base-content/50">
                <span>Posted by {getPosterName(gig)}</span>
                {gig.createdAt && <span>{new Date(gig.createdAt).toLocaleDateString()}</span>}
              </div>

              <div className="card-actions justify-end">
                {onView && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onView(gig.id)}>
                    View
                  </button>
                )}
                {showApplyButton && (
                  <button type="button" className="btn btn-outline btn-sm" disabled>
                    Apply pending
                  </button>
                )}
                {showManageActions && (
                  <>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => onEdit?.(gig)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-error btn-sm"
                      onClick={() => onDelete?.(gig)}
                      disabled={deletingId === gig.id}
                    >
                      {deletingId === gig.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default GigList
