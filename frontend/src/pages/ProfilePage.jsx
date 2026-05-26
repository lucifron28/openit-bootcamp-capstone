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
        </div>

        <ProfileDetails isError={meQuery.isError} isLoading={meQuery.isLoading} me={meQuery.data} />
        <ProfileSocialLinks />
        <ProfileSkills />
      </div>
    </section>
  )
}

export default ProfilePage
