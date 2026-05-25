import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { getApiErrorMessage } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'
import AuthShell from './AuthShell'
import { loginSchema } from './authSchemas'

function LoginPage() {
  const location = useLocation()
  const { loginMutation } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values) => {
    loginMutation.mutate(values)
  }

  return (
    <AuthShell title="Log in" subtitle="Use your SideKick account to continue.">
      {location.state?.registrationSuccess && (
        <div className="alert alert-success mb-5">
          <span>Registration successful. You can log in now.</span>
        </div>
      )}

      {loginMutation.isError && (
        <div className="alert alert-error mb-5">
          <span>{getApiErrorMessage(loginMutation.error)}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text">Email</span>
          </span>
          <input
            type="email"
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <span className="mt-1 text-sm text-error">{errors.email.message}</span>}
        </label>

        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text">Password</span>
          </span>
          <input
            type="password"
            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <span className="mt-1 text-sm text-error">{errors.password.message}</span>
          )}
        </label>

        <button type="submit" className="btn btn-primary w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-base-content/70">
        New to SideKick?{' '}
        <Link to="/register" className="link link-primary font-medium">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}

export default LoginPage
