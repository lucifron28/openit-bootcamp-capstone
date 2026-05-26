import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getApiErrorMessage } from '../../api/authApi'
import { useAuth } from '../../hooks/useAuth'
import AuthShell from './AuthShell'
import { registerSchema } from './authSchemas'

function RegisterPage() {
  const { registerMutation } = useAuth({ checkCurrentUser: false })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values) => {
    registerMutation.mutate({
      email: values.email,
      password: values.password,
    })
  }

  return (
    <AuthShell title="Create account" subtitle="Enter your details">
      {registerMutation.isError && (
        <div className="alert alert-error mb-5">
          <span>{getApiErrorMessage(registerMutation.error)}</span>
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <span className="mt-1 text-sm text-error">{errors.password.message}</span>
          )}
        </label>

        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text">Confirm password</span>
          </span>
          <input
            type="password"
            className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Repeat your password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="mt-1 text-sm text-error">{errors.confirmPassword.message}</span>
          )}
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-base-content/70">
        Already have an account?{' '}
        <Link to="/login" className="link link-primary font-medium">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}

export default RegisterPage
