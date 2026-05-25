function AuthShell({ children, title, subtitle }) {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-base-200 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-primary p-8 text-primary-content sm:p-10">
          <p className="text-sm font-semibold uppercase opacity-80">SideKick</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight">
            tagline?
          </h1>
          <p className="mt-5 max-w-md text-base opacity-90">
            Sign in
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-base-content/70">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}

export default AuthShell
