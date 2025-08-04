import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendance',
        href: '/attendance',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface AttendanceRecord {
    id: number;
    type: 'check_in' | 'check_out';
    recorded_at: string;
    latitude?: number;
    longitude?: number;
    location_address?: string;
    user?: User;
}

interface PaginationData {
    data: AttendanceRecord[];
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
    records: PaginationData;
    isAdmin: boolean;
    [key: string]: unknown;
}

export default function AttendanceIndex({ records, isAdmin }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            <Head title="Attendance Records" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Attendance Records
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isAdmin ? 'View all employee attendance records' : 'Your attendance history'}
                        </p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{records.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">This Page</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{records.data.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Page</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {records.current_page} of {records.last_page}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Records */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🕒 Attendance History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {records.data.length > 0 ? (
                            <div className="space-y-4">
                                {records.data.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">
                                                {getTypeIcon(record.type)}
                                            </span>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    {getTypeBadge(record.type)}
                                                    {isAdmin && record.user && (
                                                        <span className="font-medium text-gray-900">
                                                            {record.user.name}
                                                        </span>
                                                    )}
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
                                            {isAdmin && record.user && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {record.user.email}
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
                                    {isAdmin ? 'No attendance records have been created yet.' : 'Start tracking your attendance from the dashboard.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {records.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {records.links.map((link, index) => (
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