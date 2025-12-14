import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile Details Form
    const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
        }
    });

    // Password Form
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch, reset: resetPasswordForm, formState: { errors: passwordErrors } } = useForm();

    const onProfileUpdate = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await userAPI.updateProfile({
                name: data.name,
                dateOfBirth: data.dateOfBirth
            });
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                // Ideally update local user context here via a refreshUser method
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    const onPasswordUpdate = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await userAPI.updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Password changed successfully' });
                resetPasswordForm();
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to update password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">Profile Settings</h1>

            {message.text && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...registerProfile('name', { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...registerProfile('email')} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" {...registerProfile('dateOfBirth')} />
                        </div>
                        <Button type="submit" disabled={loading}>Update Profile</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                {...registerPassword('currentPassword', { required: "Current password is required" })}
                            />
                            {passwordErrors.currentPassword && <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...registerPassword('newPassword', {
                                    required: "New password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                            />
                            {passwordErrors.newPassword && <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...registerPassword('confirmPassword', {
                                    validate: (val) => {
                                        if (watch('newPassword') != val) {
                                            return "Your passwords do not match";
                                        }
                                    }
                                })}
                            />
                            {passwordErrors.confirmPassword && <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>}
                        </div>
                        <Button type="submit" className="bg-green-500" variant="secondary" disabled={loading}>Change Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
