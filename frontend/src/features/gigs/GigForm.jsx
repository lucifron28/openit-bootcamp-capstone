import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const gigFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.'),
  description: z.string().trim().min(1, 'Description is required.'),
})

function GigForm({ isSubmitting = false, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const handleValidSubmit = (values) => {
    onSubmit(
      {
        title: values.title.trim(),
        description: values.description.trim(),
      },
      reset,
    )
  }

  return (
    <form className="card border border-base-300 bg-base-100 shadow-sm" onSubmit={handleSubmit(handleValidSubmit)}>
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Post a gig</h2>
          <p className="text-sm text-base-content/70">
            Share a small local task for the community.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="form-control">
            <span className="label-text mb-1">Title</span>
            <input
              className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Help move boxes"
              {...register('title')}
            />
            {errors.title && <span className="mt-1 text-sm text-error">{errors.title.message}</span>}
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Description</span>
            <textarea
              className={`textarea textarea-bordered min-h-28 ${errors.description ? 'textarea-error' : ''}`}
              placeholder="Describe the task, timing, and what kind of help you need."
              {...register('description')}
            />
            {errors.description && (
              <span className="mt-1 text-sm text-error">{errors.description.message}</span>
            )}
          </label>
        </div>

        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post gig'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default GigForm
