import { useState } from 'react'
import { useCreateSkill, useDeleteSkill, useSkills } from '../hooks/useSkills'

function SkillsPage() {
  const [name, setName] = useState('')
  const skillsQuery = useSkills()
  const createMutation = useCreateSkill()
  const deleteMutation = useDeleteSkill()

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    createMutation.mutate(
      { name: name.trim() },
      {
        onSuccess: () => setName(''),
      },
    )
  }

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Skills</p>
          <h1 className="mt-2 text-3xl font-bold">Skill directory</h1>
        </div>

        <form className="card border border-base-300 bg-base-100 shadow-sm" onSubmit={handleSubmit}>
          <div className="card-body gap-4 sm:flex-row sm:items-end">
            <label className="form-control flex-1">
              <span className="label-text mb-1">Skill name</span>
              <input
                className="input input-bordered"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Cleaning"
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
              Add skill
            </button>
          </div>
        </form>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">All skills</h2>
            {skillsQuery.isLoading && <span className="loading loading-spinner text-primary" />}
            {skillsQuery.isError && <p className="text-sm text-error">Could not load skills.</p>}
            {skillsQuery.data?.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {skillsQuery.data.map((skill) => (
                  <article
                    key={skill.id}
                    className="flex items-center justify-between rounded-box border border-base-300 p-4"
                  >
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-base-content/60">
                        {skill.isGlobal ? 'Global' : 'User added'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => deleteMutation.mutate(skill.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              !skillsQuery.isLoading && <p className="text-sm text-base-content/70">No skills yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkillsPage
