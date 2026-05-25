import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-base-200 px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-base-content/70">
          Page Not Found
        </p>
        <Link to="/" className="btn btn-primary mt-6">
          Go home
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
