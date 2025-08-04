import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: 'employee' | 'admin';
    created_at: string;
    attendance_records_count?: number;
}

interface PaginationData {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    users: PaginationData;
    [key: string]: unknown;
}

export default function UsersIndex({ users }: Props) {
    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            router.delete(route('users.destroy', user.id), {
                preserveState: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            👥 User Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage employee and admin accounts
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard">
                            <Button variant="outline">
                                ← Dashboard
                            </Button>
                        </Link>
                        <Link href="/users/create">
                            <Button>
                                ➕ Add User
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter(user => user.role === 'employee').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.data.filter(user => user.role === 'admin').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">This Page</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.data.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📋 All Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.data.length > 0 ? (
                            <div className="space-y-4">
                                {users.data.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">
                                                {getRoleIcon(user.role)}
                                            </span>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-gray-900">
                                                        {user.name}
                                                    </span>
                                                    {getRoleBadge(user.role)}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {user.email}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Joined {formatDate(user.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={route('users.show', user.id)}>
                                                <Button variant="outline" size="sm">
                                                    👁️ View
                                                </Button>
                                            </Link>
                                            <Link href={route('users.edit', user.id)}>
                                                <Button variant="outline" size="sm">
                                                    ✏️ Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600 mb-4">
                                    Get started by adding your first user account.
                                </p>
                                <Link href="/users/create">
                                    <Button>
                                        ➕ Add First User
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {users.links.map((link, index) => (
                            <div key={index}>
                                {link.url ? (
                                    <Link 
                                        href={link.url} 
                                        className={`px-3 py-2 text-sm rounded-md border ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span 
                                        className="px-3 py-2 text-sm text-gray-400 border border-gray-200 rounded-md"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}