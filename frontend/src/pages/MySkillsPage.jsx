import { useAssignMySkill, useMySkills, useRemoveMySkill } from '../hooks/useMe'
import { useSkills } from '../hooks/useSkills'

function MySkillsPage() {
  const skillsQuery = useSkills()
  const mySkillsQuery = useMySkills()
  const assignMutation = useAssignMySkill()
  const removeMutation = useRemoveMySkill()

  const assignedIds = new Set(mySkillsQuery.data?.map((skill) => skill.id) ?? [])

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Profile</p>
          <h1 className="mt-2 text-3xl font-bold">My skills</h1>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Available skills</h2>
            {(skillsQuery.isLoading || mySkillsQuery.isLoading) && (
              <span className="loading loading-spinner text-primary" />
            )}
            {(skillsQuery.isError || mySkillsQuery.isError) && (
              <p className="text-sm text-error">Could not load skills.</p>
            )}
            {skillsQuery.data?.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {skillsQuery.data.map((skill) => {
                  const isAssigned = assignedIds.has(skill.id)

                  return (
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
                      {isAssigned ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => removeMutation.mutate(skill.id)}
                          disabled={removeMutation.isPending}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => assignMutation.mutate(skill.id)}
                          disabled={assignMutation.isPending}
                        >
                          Add
                        </button>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MySkillsPage
