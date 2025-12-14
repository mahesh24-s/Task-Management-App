import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Layout from '../components/Layout';

const SignupPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);
    const {  registerUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setSubmitError('');
        const { name, email, password, confirmPassword } = data;

        if (password !== confirmPassword) {
            setSubmitError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await registerUser(name, email, password);

        if (result.success) {
            navigate('/login');
        } else {
            setSubmitError(result.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your information to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {submitError && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                    {submitError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("name", { required: "Name is required" })}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("confirmPassword", { required: "Please confirm your password" })}
                                />
                                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default SignupPage;
