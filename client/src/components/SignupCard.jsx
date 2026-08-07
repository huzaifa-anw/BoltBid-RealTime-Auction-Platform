import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';

export default function SignupCard() {

    // error states
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // success states
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // error state
    const [isLoading, setIsLoading] = useState(false);

    // form input state
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    let navigate = useNavigate();

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // VALIDATE DATA
        if (!form.firstName.trim()) {
            setIsError(true);
            setErrorMessage("First Name is required");
            return;
        }

        if (!form.lastName.trim()) {
            setIsError(true);
            setErrorMessage("Last Name is required");
            return;
        }

        if (!form.email.trim()) {
            setIsError(true);
            setErrorMessage("Email is required");
            return;
        }

        if (!form.password || !form.confirmPassword) {
            setIsError(true);
            setErrorMessage("Password is required");
            return;
        }

        if (form.password !== form.confirmPassword){
            setIsError(true);
            setErrorMessage('Passwords don\'t match');
            return;
        }

        if(!emailRegex.test(form.email.trim())) {
            setIsError(true);
            setErrorMessage('Invalid email format');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/signup",
                {
                    name: `${form.firstName} ${form.lastName}`,
                    email: form.email,
                    password: form.password,
                }
            );

            console.dir(response);

            if (response.data.success) {
                localStorage.setItem('token', response.data.data.accessToken);
                setIsSuccess(true);
                setSuccessMessage('Account created successfully');
                navigate("/home")
            } 
            else {
                setIsError(true);
                setErrorMessage(response.data.message || 'Signup failed');
            }
        } catch (e) {
            console.log("an error occured");
            console.dir(e);
            setIsError(true);
            if (e.response) {
                const data = e.response.data;
                
                if (data.errorCode === "VALIDATION_ERROR") {
                    setErrorMessage("All fields are required");
                }
                else if (data.errorCode === "INVALID_EMAIL_FORMAT") {
                    setErrorMessage("Please enter a valid email address")
                }
                else if (data.errorCode === "USER_EXISTS") {
                    setErrorMessage("Account already exists, Please Log In")
                }
                else if (data.errorCode === "DB_DOWN") {
                    setErrorMessage("Database is currently unavailable, Please wait before trying again")
                }
                return;
            }
            setErrorMessage('An error occurred while signing up');
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
                            Auction speed with a premium edge
                        </h2>
                        <p className="mx-auto max-w-xs text-sm leading-6 text-slate-300 sm:max-w-sm">
                            Join the marketplace built for modern sellers and buyers who want bold performance, clear bids, and real-time momentum.
                        </p>
                    </div>
                    <div className="relative z-10 grid gap-3 text-sm text-slate-300">
                        <p className="inline-flex items-center justify-center rounded-full border border-slate-700/60 bg-slate-950/70 px-4 py-2">
                            Modern. Fast. Competitive.
                        </p>
                        <p className="inline-flex items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-2">
                            Secure signups, instant listings.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 sm:p-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 space-y-3 text-center">
                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Create your account</p>
                            <h3 className="text-3xl font-semibold text-black">Start bidding smarter</h3>
                            <p className="text-sm leading-6 text-slate-400">
                                Fill in your details and unlock a marketplace made for high-velocity auctions.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200">

                            {/* Error Message */}
                            {
                                isError
                                &&
                                (<div className="min-h-[1.5rem] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <span className="block">{errorMessage}</span>
                                </div>)
                            }
                            {/* Error Message */}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm text-slate-950">
                                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">First name</span>
                                    <input
                                        type="text"
                                        name='firstName'
                                        value={form.firstName}
                                        onChange={handleChange}
                                        // required
                                        placeholder="John"
                                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                </label>
                                <label className="block text-sm text-slate-950">
                                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Last name</span>
                                    <input
                                        type="text"
                                        name='lastName'
                                        value={form.lastName}
                                        onChange={handleChange}
                                        // required
                                        placeholder="Doe"
                                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                </label>
                            </div>

                            <label className="block text-sm text-slate-950">
                                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    // required
                                    placeholder="you@example.com"
                                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm text-slate-950">
                                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Password</span>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        // required
                                        placeholder="Enter a strong password"
                                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                </label>
                                <label className="block text-sm text-slate-950">
                                    <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-500">Confirm password</span>
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        // required
                                        placeholder="Confirm password"
                                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
