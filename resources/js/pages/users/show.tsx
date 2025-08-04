import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

interface AttendanceRecord {
    id: number;
    type: 'check_in' | 'check_out';
    recorded_at: string;
    latitude?: number;
    longitude?: number;
    location_address?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: 'employee' | 'admin';
    created_at: string;
    attendance_records: AttendanceRecord[];
}

interface Props {
    user: User;
    [key: string]: unknown;
}

export default function ShowUser({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? '👑' : '👤';
    };

    const getRoleBadge = (role: string) => {
        return role === 'admin' ? (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                👑 Admin
            </Badge>
        ) : (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                👤 Employee
            </Badge>
        );
    };

    const getTypeIcon = (type: string) => {
        return type === 'check_in' ? '🟢' : '🔴';
    };

    const getTypeBadge = (type: string) => {
        return type === 'check_in' ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                ✅ Check In
            </Badge>
        ) : (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                🏁 Check Out
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name} - User Profile`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">{getRoleIcon(user.role)}</span>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {user.name}
                            </h1>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                {user.email} • {getRoleBadge(user.role)}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/users">
                            <Button variant="outline">
                                ← Back to Users
                            </Button>
                        </Link>
                        <Link href={route('users.edit', user.id)}>
                            <Button variant="outline">
                                ✏️ Edit User
                            </Button>
                        </Link>
                        <Button 
                            variant="outline"
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            🗑️ Delete User
                        </Button>
                    </div>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">Member Since</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">{formatDate(user.created_at)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">Total Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold">{user.attendance_records.length} records</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">User Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{getRoleIcon(user.role)}</span>
                                <span className="text-lg font-semibold capitalize">{user.role}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🕒 Recent Attendance Records
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.attendance_records.length > 0 ? (
                            <div className="space-y-4">
                                {user.attendance_records.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">
                                                {getTypeIcon(record.type)}
                                            </span>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    {getTypeBadge(record.type)}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {formatDateTime(record.recorded_at)}
                                                </p>
                                                {record.location_address && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        📍 {record.location_address}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {record.latitude && record.longitude && (
                                                <Badge variant="outline" className="text-xs">
                                                    GPS: {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
                                <p className="text-gray-600">
                                    This user hasn't recorded any attendance yet.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* User Permissions */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🔐 User Permissions & Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Current Permissions</h4>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✅</span>
                                        Can log in to the system
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✅</span>
                                        Can record attendance (check-in/out)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✅</span>
                                        Can view personal attendance history
                                    </li>
                                    {user.role === 'admin' && (
                                        <>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✅</span>
                                                Can manage all users
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✅</span>
                                                Can view all attendance records
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-green-500">✅</span>
                                                Can access admin dashboard
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Account Status</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                                        <span>Account is active and operational</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">Verified</Badge>
                                        <span>Email address is verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}