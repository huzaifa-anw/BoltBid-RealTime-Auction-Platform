import { useState } from 'react';
import { Link } from 'react-router';

export default function LoginCard() {
    // error / success / loading states
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // form input state
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => (
            {
                ...prev,
                [name]: value
            }   
        ))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsError(false);
        setErrorMessage('');
        setIsSuccess(false);
        setSuccessMessage('');

        if (!form.email.trim()) {
            setIsError(true);
            setErrorMessage("Email is required");
            return;
        }

        if (!form.password) {
            setIsError(true);
            setErrorMessage("Password is required");
            return;
        }

        setIsLoading(true);

        try {
            // TODO: replace with actual login API call
            setIsSuccess(true);
            setSuccessMessage('Login successful');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid w-full gap-8 overflow-hidden rounded-[2rem] border border-slate-700/80 shadow-2xl shadow-slate-950/15 lg:grid-cols-[1.1fr_1.9fr]">
                <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-[1.75rem] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_20%),linear-gradient(180deg,_#111827_0%,_#111827_100%)] p-8 text-center text-slate-100 sm:p-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%)]" />
                    <div className="relative z-10 mx-auto w-full max-w-[240px] px-6">
                        <img src="/boltbid.webp" alt="BoltBid logo" className="mx-auto h-auto w-full object-contain" />
                    </div>
                    <div className="relative z-10 space-y-3">
                        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Welcome back to BoltBid
                        </h2>
                        <p className="mx-auto max-w-xs text-sm leading-6 text-slate-300 sm:max-w-sm">
                            Log in and access your auctions, bids, and dashboard with speed and confidence.
                        </p>
                    </div>
                    <div className="relative z-10 grid gap-3 text-sm text-slate-300">
                        <p className="inline-flex items-center justify-center rounded-full border border-slate-700/60 bg-slate-950/70 px-4 py-2">
                            Fast access
                        </p>
                        <p className="inline-flex items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2">
                            Secure login
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 sm:p-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 space-y-3 text-center">
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Log in</p>
                            <h3 className="text-3xl font-semibold text-black">Access your auction flow</h3>
                            <p className="text-sm leading-6 text-slate-400">
                                Enter your credentials to continue bidding and managing your marketplace activity.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                            {isSuccess && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {successMessage}
                                </div>
                            )}
                            {isError && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            <label className="block text-sm text-slate-950">
                                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Email</span>
                                <input
                                    type="email"
                                    name='email'
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                />
                            </label>

                            <label className="block text-sm text-slate-950">
                                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Password</span>
                                <input
                                    type="password"
                                    name='password'
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? 'Signing in...' : 'Log In'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Don&apos;t have an account?{' '}
                            <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
