import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAssignMySkill, useMySkills, useRemoveMySkill } from '../../hooks/useMe'
import { useCreateSkill, useSkills } from '../../hooks/useSkills'

const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill is required.'),
})

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

function ProfileSkills() {
  const skillsQuery = useSkills()
  const mySkillsQuery = useMySkills()
  const createMutation = useCreateSkill()
  const assignMutation = useAssignMySkill()
  const removeMutation = useRemoveMySkill()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
    },
  })

  const assignedIds = useMemo(
    () => new Set((mySkillsQuery.data ?? []).map((skill) => skill.id)),
    [mySkillsQuery.data],
  )

  const isSaving = createMutation.isPending || assignMutation.isPending

  const handleAddSkill = (values) => {
    const name = values.name.trim()
    const existingSkill = (skillsQuery.data ?? []).find((skill) => normalize(skill.name) === normalize(name))

    if (existingSkill) {
      if (assignedIds.has(existingSkill.id)) {
        reset()
        return
      }

      assignMutation.mutate(existingSkill.id, {
        onSuccess: () => reset(),
      })
      return
    }

    createMutation.mutate(
      { name },
      {
        onSuccess: (createdSkill) => {
          if (createdSkill?.id) {
            assignMutation.mutate(createdSkill.id)
          }

          reset()
        },
      },
    )
  }

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">My skills</h2>
          <p className="text-sm text-base-content/70">Add skills that help people choose you for gigs.</p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit(handleAddSkill)}>
          <label className="form-control flex-1">
            <span className="label-text mb-1">Skill</span>
            <input
              className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Cleaning, tutoring, errands"
              {...register('name')}
            />
            {errors.name && <span className="mt-1 text-sm text-error">{errors.name.message}</span>}
          </label>

          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Adding...' : 'Add skill'}
          </button>
        </form>

        {(skillsQuery.isError || mySkillsQuery.isError || createMutation.isError || assignMutation.isError) && (
          <p className="text-sm text-error">Could not update skills.</p>
        )}

        {(skillsQuery.isLoading || mySkillsQuery.isLoading) && (
          <span className="loading loading-spinner text-primary" />
        )}

        {mySkillsQuery.data?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {mySkillsQuery.data.map((skill) => (
              <span key={skill.id} className="badge badge-primary badge-outline gap-2 py-3">
                {skill.name}
                <button
                  type="button"
                  className="text-xs"
                  onClick={() => removeMutation.mutate(skill.id)}
                  disabled={removeMutation.isPending}
                >
                  remove
                </button>
              </span>
            ))}
          </div>
        ) : (
          !mySkillsQuery.isLoading && <p className="text-sm text-base-content/70">No skills added yet.</p>
        )}
      </div>
    </article>
  )
}

export default ProfileSkills
