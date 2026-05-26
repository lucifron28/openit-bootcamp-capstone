import { Link } from 'react-router-dom'
import { useMe, useMySkills } from '../hooks/useMe'

function ProfilePage() {
  const meQuery = useMe()
  const mySkillsQuery = useMySkills()

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Profile</p>
          <h1 className="mt-2 text-3xl font-bold">My account</h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Details</h2>
              {meQuery.isLoading && <span className="loading loading-spinner text-primary" />}
              {meQuery.isError && <p className="text-sm text-error">Could not load profile.</p>}
              {meQuery.data && (
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-base-content/60">Name</dt>
                    <dd className="font-medium">
                      {[meQuery.data.firstName, meQuery.data.lastName].filter(Boolean).join(' ') ||
                        'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-base-content/60">Username</dt>
                    <dd className="font-medium">{meQuery.data.username || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-base-content/60">Email</dt>
                    <dd className="font-medium">{meQuery.data.email || 'Not set'}</dd>
                  </div>
                  <div>
                    <dt className="text-base-content/60">Phone</dt>
                    <dd className="font-medium">{meQuery.data.phoneNumber || 'Not set'}</dd>
                  </div>
                </dl>
              )}
            </div>
          </article>

          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Quick links</h2>
              <div className="flex flex-wrap gap-2">
                <Link to="/profile/skills" className="btn btn-primary btn-sm">
                  My skills
                </Link>
                <Link to="/profile/sociallinks" className="btn btn-outline btn-sm">
                  Social links
                </Link>
              </div>
            </div>
          </article>
        </div>

        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">My skills</h2>
            {mySkillsQuery.isLoading && <span className="loading loading-spinner text-primary" />}
            {mySkillsQuery.isError && <p className="text-sm text-error">Could not load skills.</p>}
            {mySkillsQuery.data?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {mySkillsQuery.data.map((skill) => (
                  <span key={skill.id} className="badge badge-primary badge-outline">
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              !mySkillsQuery.isLoading && <p className="text-sm text-base-content/70">No skills yet.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

export default ProfilePage
