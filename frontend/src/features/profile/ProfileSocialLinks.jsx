import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^https?:\/\/\S+\.\S+/.test(value), 'Enter a valid URL.')

const socialLinksSchema = z.object({
  facebookUrl: optionalUrl,
  messengerUrl: optionalUrl,
  instagramUrl: optionalUrl,
  phoneNumber: z.string().trim().optional(),
})

function toDisplayLinks(links) {
  return Object.entries(links)
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({
      name: key === 'phoneNumber' ? 'Phone number' : key.replace('Url', ''),
      href,
      isUrl: key !== 'phoneNumber',
    }))
}

function ProfileSocialLinks() {
  const [savedLinks, setSavedLinks] = useState({
    facebookUrl: '',
    messengerUrl: '',
    instagramUrl: '',
    phoneNumber: '',
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: savedLinks,
  })

  const localLinks = toDisplayLinks(savedLinks)

  const handleSave = (values) => {
    setSavedLinks({
      facebookUrl: values.facebookUrl?.trim() ?? '',
      messengerUrl: values.messengerUrl?.trim() ?? '',
      instagramUrl: values.instagramUrl?.trim() ?? '',
      phoneNumber: values.phoneNumber?.trim() ?? '',
    })
  }

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Contact / social links</h2>
          <p className="text-sm text-base-content/70">
            Since the MVP has no chat, these contact links are how users can reach each other.
          </p>
        </div>

        <div className="alert">
          <span>Social link editing is pending backend support.</span>
        </div>

        {isSubmitSuccessful && (
          <div className="alert alert-success">
            <span>Local contact links draft updated. This is not persisted yet.</span>
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit(handleSave)}>
          <label className="form-control">
            <span className="label-text mb-1">Facebook URL</span>
            <input
              className={`input input-bordered ${errors.facebookUrl ? 'input-error' : ''}`}
              placeholder="https://facebook.com/..."
              {...register('facebookUrl')}
            />
            {errors.facebookUrl && (
              <span className="mt-1 text-sm text-error">{errors.facebookUrl.message}</span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Messenger URL</span>
            <input
              className={`input input-bordered ${errors.messengerUrl ? 'input-error' : ''}`}
              placeholder="https://m.me/..."
              {...register('messengerUrl')}
            />
            {errors.messengerUrl && (
              <span className="mt-1 text-sm text-error">{errors.messengerUrl.message}</span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Instagram URL</span>
            <input
              className={`input input-bordered ${errors.instagramUrl ? 'input-error' : ''}`}
              placeholder="https://instagram.com/..."
              {...register('instagramUrl')}
            />
            {errors.instagramUrl && (
              <span className="mt-1 text-sm text-error">{errors.instagramUrl.message}</span>
            )}
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Phone number</span>
            <input
              className="input input-bordered"
              placeholder="09..."
              {...register('phoneNumber')}
            />
          </label>

          <div className="md:col-span-2 xl:col-span-4 flex justify-end">
            <button type="submit" className="btn btn-primary">
              Save local draft
            </button>
          </div>
        </form>

        {localLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {localLinks.map((link) => (
              link.isUrl ? (
                <a key={link.name} className="badge badge-outline" href={link.href}>
                  {link.name}
                </a>
              ) : (
                <span key={link.name} className="badge badge-outline">
                  {link.name}
                </span>
              )
            ))}
          </div>
        ) : (
          <p className="text-sm text-base-content/70">Complete your profile so others can contact you.</p>
        )}
      </div>
    </article>
  )
}

export default ProfileSocialLinks
