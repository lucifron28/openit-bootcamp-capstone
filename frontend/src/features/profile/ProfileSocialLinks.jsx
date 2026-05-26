import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  useCreateMySocialLink,
  useDeleteMySocialLink,
  useGetMySocialLinks,
} from '../../hooks/useMe'

const socialLinkFields = [
  {
    key: 'facebookUrl',
    name: 'Facebook',
    label: 'Facebook URL',
    placeholder: 'https://facebook.com/...',
    aliases: ['facebookurl'],
  },
  {
    key: 'messengerUrl',
    name: 'Messenger',
    label: 'Messenger URL',
    placeholder: 'https://m.me/...',
    aliases: ['messengerurl'],
  },
  {
    key: 'instagramUrl',
    name: 'Instagram',
    label: 'Instagram URL',
    placeholder: 'https://instagram.com/...',
    aliases: ['instagramurl'],
  },
  {
    key: 'phoneNumber',
    name: 'Phone number',
    label: 'Phone number',
    placeholder: '09...',
    aliases: ['phone', 'phonenumber', 'contactnumber'],
  },
]

const emptySocialLinks = socialLinkFields.reduce(
  (values, field) => ({
    ...values,
    [field.key]: '',
  }),
  {},
)

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || isHttpUrl(value), 'Enter a valid URL.')

const socialLinksSchema = z.object({
  facebookUrl: optionalUrl,
  messengerUrl: optionalUrl,
  instagramUrl: optionalUrl,
  phoneNumber: z.string().trim().max(30, 'Phone number is too long.').optional(),
})

function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.')
  } catch {
    return false
  }
}

function normalizeName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function getFieldNames(field) {
  return new Set([field.key, field.name, ...field.aliases].map(normalizeName))
}

function getLinksForField(links, field) {
  const fieldNames = getFieldNames(field)

  return links.filter((link) => fieldNames.has(normalizeName(link.name)))
}

function trimValues(values) {
  return socialLinkFields.reduce(
    (trimmedValues, field) => ({
      ...trimmedValues,
      [field.key]: values[field.key]?.trim() ?? '',
    }),
    {},
  )
}

function toFormValues(links) {
  return socialLinkFields.reduce((values, field) => {
    const link = getLinksForField(links, field)[0]

    return {
      ...values,
      [field.key]: link?.href ?? '',
    }
  }, emptySocialLinks)
}

function toDisplayLinks(links) {
  return links.map((link) => ({
    id: link.id,
    name: link.name,
    href: link.href,
    isUrl: isHttpUrl(link.href),
    isPhoneNumber: normalizeName(link.name) === 'phonenumber',
  }))
}

function ProfileSocialLinks() {
  const [saveMessage, setSaveMessage] = useState('')
  const socialLinksQuery = useGetMySocialLinks()
  const createMutation = useCreateMySocialLink()
  const deleteMutation = useDeleteMySocialLink()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: emptySocialLinks,
  })

  const socialLinks = useMemo(() => socialLinksQuery.data ?? [], [socialLinksQuery.data])
  const displayLinks = useMemo(() => toDisplayLinks(socialLinks), [socialLinks])
  const isSaving = createMutation.isPending || deleteMutation.isPending
  const isError = socialLinksQuery.isError || createMutation.isError || deleteMutation.isError

  useEffect(() => {
    if (socialLinksQuery.data) {
      reset(toFormValues(socialLinksQuery.data))
    }
  }, [reset, socialLinksQuery.data])

  const handleSave = async (values) => {
    const nextValues = trimValues(values)
    const linksToDelete = []
    const linksToCreate = []

    setSaveMessage('')

    socialLinkFields.forEach((field) => {
      const matchingLinks = getLinksForField(socialLinks, field)
      const nextHref = nextValues[field.key]
      const unchanged =
        matchingLinks.length === 1 &&
        normalizeName(matchingLinks[0].name) === normalizeName(field.name) &&
        matchingLinks[0].href.trim() === nextHref

      if (unchanged) {
        return
      }

      linksToDelete.push(...matchingLinks)

      if (nextHref) {
        linksToCreate.push({
          name: field.name,
          href: nextHref,
        })
      }
    })

    if (linksToDelete.length === 0 && linksToCreate.length === 0) {
      reset(nextValues)
      setSaveMessage('Contact links are already up to date.')
      return
    }

    for (const link of linksToDelete) {
      await deleteMutation.mutateAsync(link.id)
    }

    for (const link of linksToCreate) {
      await createMutation.mutateAsync(link)
    }

    reset(nextValues)
    setSaveMessage('Contact links saved.')
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

        {socialLinksQuery.isLoading && <span className="loading loading-spinner text-primary" />}
        {isError && <p className="text-sm text-error">Could not update contact links.</p>}
        {saveMessage && !isError && (
          <div className="alert alert-success">
            <span>{saveMessage}</span>
          </div>
        )}

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={handleSubmit(handleSave)}>
          {socialLinkFields.map((field) => (
            <label key={field.key} className="form-control">
              <span className="label-text mb-1">{field.label}</span>
              <input
                className={`input input-bordered ${errors[field.key] ? 'input-error' : ''}`}
                placeholder={field.placeholder}
                {...register(field.key)}
              />
              {errors[field.key] && (
                <span className="mt-1 text-sm text-error">{errors[field.key].message}</span>
              )}
            </label>
          ))}

          <div className="md:col-span-2 xl:col-span-4 flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={isSaving || socialLinksQuery.isLoading}>
              {isSaving ? 'Saving...' : 'Save links'}
            </button>
          </div>
        </form>

        {displayLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {displayLinks.map((link) => (
              <span key={link.id} className="badge badge-primary badge-outline gap-2 py-3">
                {link.isUrl ? (
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.name}
                  </a>
                ) : (
                  <span>{link.isPhoneNumber ? link.href : `${link.name}: ${link.href}`}</span>
                )}
                <button
                  type="button"
                  className="text-xs"
                  onClick={() => {
                    setSaveMessage('')
                    deleteMutation.mutate(link.id, {
                      onSuccess: () => setSaveMessage('Contact link removed.'),
                    })
                  }}
                  disabled={deleteMutation.isPending}
                >
                  remove
                </button>
              </span>
            ))}
          </div>
        ) : (
          !socialLinksQuery.isLoading && (
            <p className="text-sm text-base-content/70">Complete your profile so others can contact you.</p>
          )
        )}
      </div>
    </article>
  )
}

export default ProfileSocialLinks
