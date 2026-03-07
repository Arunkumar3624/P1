import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");
      await login(values);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-panel">
        <h1 className="font-display text-2xl font-bold text-navy">EMS Login</h1>
        <p className="mt-1 text-sm text-slate-500">Secure access to your workforce command center.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-actionBlue focus:outline-none"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">Email is required.</p>}
          </div>
          <div>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-actionBlue focus:outline-none"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-600">Password is required.</p>}
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-actionBlue px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
