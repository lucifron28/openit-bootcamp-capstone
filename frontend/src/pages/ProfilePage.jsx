import ProfileDetails from '../features/profile/ProfileDetails'
import ProfileSkills from '../features/profile/ProfileSkills'
import ProfileSocialLinks from '../features/profile/ProfileSocialLinks'
import { useMe } from '../hooks/useMe'

function ProfilePage() {
  const meQuery = useMe()

  return (
    <section className="bg-base-200 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Profile</p>
          <h1 className="mt-2 text-3xl font-bold">My profile</h1>
          <p className="mt-3 max-w-2xl text-base-content/70">
            Keep your identity, contact details, and skills together so other users know how to
            reach you.
          </p>
        </div>

        <ProfileDetails isError={meQuery.isError} isLoading={meQuery.isLoading} me={meQuery.data} />
        <ProfileSocialLinks />
        <ProfileSkills />
      </div>
    </section>
  )
}

export default ProfilePage
