import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const profileDetailsSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required.'),
  location: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  bio: z.string().trim().max(500, 'Bio must be 500 characters or less.').optional(),
})

function getDisplayName(me) {
  return [me?.firstName, me?.lastName].filter(Boolean).join(' ')
}

function ProfileDetails({ isError, isLoading, me }) {
  const [savedDetails, setSavedDetails] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      displayName: '',
      location: '',
      phoneNumber: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (!me) {
      return
    }

    reset({
      displayName: savedDetails?.displayName || getDisplayName(me) || me.username || me.email || '',
      location: savedDetails?.location ?? '',
      phoneNumber: savedDetails?.phoneNumber ?? me.phoneNumber ?? '',
      bio: savedDetails?.bio ?? '',
    })
  }, [me, reset, savedDetails])

  const handleSave = (values) => {
    setSavedDetails({
      displayName: values.displayName.trim(),
      location: values.location?.trim() ?? '',
      phoneNumber: values.phoneNumber?.trim() ?? '',
      bio: values.bio?.trim() ?? '',
    })
  }

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
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <dt className="text-base-content/60">Email</dt>
                <dd className="font-medium">{me.email || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-base-content/60">Username</dt>
                <dd className="font-medium">{me.username || me.email || 'Not set'}</dd>
              </div>
            </dl>

            {isSubmitSuccessful && (
              <div className="alert alert-success">
                <span>Profile draft updated.</span>
              </div>
            )}

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(handleSave)}>
              <label className="form-control md:col-span-2">
                <span className="label-text mb-1">Display name</span>
                <input
                  className={`input input-bordered ${errors.displayName ? 'input-error' : ''}`}
                  placeholder="Your public name"
                  {...register('displayName')}
                />
                {errors.displayName && (
                  <span className="mt-1 text-sm text-error">{errors.displayName.message}</span>
                )}
              </label>

              <label className="form-control">
                <span className="label-text mb-1">Location</span>
                <input
                  className="input input-bordered"
                  placeholder="Barangay, city, or area"
                  {...register('location')}
                />
              </label>

              <label className="form-control">
                <span className="label-text mb-1">Phone number</span>
                <input
                  className="input input-bordered"
                  placeholder="Contact number"
                  {...register('phoneNumber')}
                />
              </label>

              <label className="form-control md:col-span-2">
                <span className="label-text mb-1">Bio</span>
                <textarea
                  className={`textarea textarea-bordered min-h-24 ${errors.bio ? 'textarea-error' : ''}`}
                  placeholder="Tell the community what kind of help you offer or need."
                  {...register('bio')}
                />
                {errors.bio && <span className="mt-1 text-sm text-error">{errors.bio.message}</span>}
              </label>

              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Save profile
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </article>
  )
}

export default ProfileDetails
