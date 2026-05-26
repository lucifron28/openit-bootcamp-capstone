import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMySocialLinks } from '../../hooks/useSocialLinks'

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^https?:\/\/\S+\.\S+/.test(value), 'Enter a valid URL.')

const socialLinksSchema = z.object({
  facebookUrl: optionalUrl,
  messengerUrl: optionalUrl,
  instagramUrl: optionalUrl,
})

function toDisplayLinks(links) {
  return Object.entries(links)
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({
      name: key.replace('Url', ''),
      href,
    }))
}

function ProfileSocialLinks() {
  const socialLinksQuery = useMySocialLinks()
  const [savedLinks, setSavedLinks] = useState({
    facebookUrl: '',
    messengerUrl: '',
    instagramUrl: '',
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: savedLinks,
  })

  const backendLinks = socialLinksQuery.data ?? []
  const localLinks = toDisplayLinks(savedLinks)

  const handleSave = (values) => {
    setSavedLinks({
      facebookUrl: values.facebookUrl?.trim() ?? '',
      messengerUrl: values.messengerUrl?.trim() ?? '',
      instagramUrl: values.instagramUrl?.trim() ?? '',
    })
  }

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Contact / social links</h2>
          <p className="text-sm text-base-content/70">Complete your profile so others can contact you.</p>
        </div>

        {isSubmitSuccessful && (
          <div className="alert alert-success">
            <span>Contact links draft updated.</span>
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-3" onSubmit={handleSubmit(handleSave)}>
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

          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="btn btn-primary">
              Save links
            </button>
          </div>
        </form>

        <div className="divider my-0" />

        {socialLinksQuery.isLoading && <span className="loading loading-spinner text-primary" />}
        {backendLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {backendLinks.map((link) => (
              <a key={link.id} className="badge badge-primary badge-outline" href={link.href}>
                {link.name}
              </a>
            ))}
          </div>
        )}

        {localLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {localLinks.map((link) => (
              <a key={link.name} className="badge badge-outline" href={link.href}>
                {link.name}
              </a>
            ))}
          </div>
        )}

        {!socialLinksQuery.isLoading && backendLinks.length === 0 && localLinks.length === 0 && (
          <p className="text-sm text-base-content/70">Complete your profile so others can contact you.</p>
        )}
      </div>
    </article>
  )
}

export default ProfileSocialLinks
