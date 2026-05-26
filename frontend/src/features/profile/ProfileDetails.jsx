function getDisplayName(me) {
  return [me?.firstName, me?.lastName].filter(Boolean).join(' ') || 'Not set'
}

function ProfileDetails({ isError, isLoading, me }) {
  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Details</h2>
          <p className="text-sm text-base-content/70">Complete your profile so others can contact you.</p>
        </div>

        {isLoading && <span className="loading loading-spinner text-primary" />}
        {isError && <p className="text-sm text-error">Could not load profile.</p>}

        {me && (
          <>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-base-content/60">Display name</dt>
                <dd className="font-medium">{getDisplayName(me)}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">Email</dt>
                <dd className="font-medium">{me.email || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">Username</dt>
                <dd className="font-medium">{me.username || me.email || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">Phone number</dt>
                <dd className="font-medium">{me.phoneNumber || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">Joined</dt>
                <dd className="font-medium">
                  {me.createdAt ? new Date(me.createdAt).toLocaleDateString() : 'Not set'}
                </dd>
              </div>
            </dl>

            <div className="alert">
              <span>Profile editing is pending backend support.</span>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

export default ProfileDetails
