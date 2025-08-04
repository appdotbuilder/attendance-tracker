import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'employee' | 'admin';
    created_at: string;
}

interface Props {
    user: User;
    [key: string]: unknown;
}

export default function EditUser({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
        {
            title: 'Edit',
            href: `/users/${user.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            ✏️ Edit User
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Update user information and permissions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('users.show', user.id)}>
                            <Button variant="outline">
                                ← Back to Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Edit Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            👤 User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">User Role</Label>
                                <Select value={data.role} onValueChange={(value: 'employee' | 'admin') => setData('role', value)}>
                                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select user role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">👤 Employee</SelectItem>
                                        <SelectItem value="admin">👑 Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-red-600">{errors.role}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Changing role will update user permissions immediately
                                </p>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password (Optional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Minimum 8 characters required if changing password
                                </p>
                            </div>

                            {/* Confirm Password */}
                            {data.password && (
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm new password"
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {processing ? '⏳ Updating User...' : '💾 Save Changes'}
                                </Button>
                                <Link href={route('users.show', user.id)}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Current Info Card */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            ℹ️ Current User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Current Name:</span>
                                <p className="text-gray-900">{user.name}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Current Email:</span>
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Current Role:</span>
                                <p className="text-gray-900 capitalize">
                                    {user.role === 'admin' ? '👑' : '👤'} {user.role}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Member Since:</span>
                                <p className="text-gray-900">
                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Warning Card */}
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h3 className="font-medium text-yellow-900 mb-2">Important Notes</h3>
                                <ul className="text-sm text-yellow-800 space-y-1">
                                    <li>• Role changes take effect immediately upon saving</li>
                                    <li>• Password changes will require the user to log in again</li>
                                    <li>• Email changes may require verification depending on settings</li>
                                    <li>• Admin roles have full system access including user management</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}