import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface AttendanceRecord {
    id: number;
    type: 'check_in' | 'check_out';
    recorded_at: string;
    location_address?: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    isAdmin: boolean;
    stats: {
        totalEmployees?: number;
        totalAdmins?: number;
        todayAttendance?: number;
        totalAttendanceRecords?: number;
        monthlyAttendance?: number;
    };
    todayStatus?: {
        hasCheckedIn: boolean;
        hasCheckedOut: boolean;
        checkInTime?: string;
        checkOutTime?: string;
    };
    recentAttendance: AttendanceRecord[];
    todayCheckIns?: AttendanceRecord[];
    [key: string]: unknown;
}

export default function Dashboard({ 
    isAdmin, 
    stats, 
    todayStatus, 
    recentAttendance, 
    todayCheckIns 
}: Props) {
    const [isGettingLocation, setIsGettingLocation] = React.useState(false);

    const handleAttendance = (type: 'check_in' | 'check_out') => {
        setIsGettingLocation(true);

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    router.post(route('attendance.store'), {
                        type,
                        latitude,
                        longitude,
                        location_address: `${latitude}, ${longitude}`, // Will be enhanced with reverse geocoding
                    }, {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsGettingLocation(false),
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Still allow attendance without location
                    router.post(route('attendance.store'), { type }, {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsGettingLocation(false),
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                }
            );
        } else {
            // Fallback for browsers without geolocation
            router.post(route('attendance.store'), { type }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsGettingLocation(false),
            });
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isAdmin ? '👑 Admin Dashboard' : '👋 Employee Dashboard'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isAdmin ? 'Manage attendance and users' : 'Track your attendance'}
                        </p>
                    </div>
                </div>

                {/* Employee Quick Actions */}
                {!isAdmin && (
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📍 Today's Attendance
                            </CardTitle>
                            <CardDescription>
                                {todayStatus?.hasCheckedIn && todayStatus?.hasCheckedOut 
                                    ? "You've completed your attendance for today!"
                                    : todayStatus?.hasCheckedIn 
                                        ? "You're checked in. Don't forget to check out!"
                                        : "Start your day by checking in"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                {todayStatus?.hasCheckedIn ? (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                            ✅ Checked In: {formatTime(todayStatus.checkInTime!)}
                                        </Badge>
                                        {todayStatus.hasCheckedOut ? (
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                🏁 Checked Out: {formatTime(todayStatus.checkOutTime!)}
                                            </Badge>
                                        ) : (
                                            <Button 
                                                onClick={() => handleAttendance('check_out')}
                                                disabled={isGettingLocation}
                                                variant="outline"
                                                className="border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                {isGettingLocation ? '📍 Getting Location...' : '🏁 Check Out'}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Button 
                                        onClick={() => handleAttendance('check_in')}
                                        disabled={isGettingLocation}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isGettingLocation ? '📍 Getting Location...' : '✅ Check In'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isAdmin ? (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                                    <span className="text-2xl">👥</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                                    <span className="text-2xl">📅</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.todayAttendance}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                                    <span className="text-2xl">📊</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalAttendanceRecords}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Admins</CardTitle>
                                    <span className="text-2xl">👑</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                                    <span className="text-2xl">📅</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.monthlyAttendance}</div>
                                    <p className="text-xs text-muted-foreground">days attended</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                                    <span className="text-2xl">📊</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalAttendanceRecords}</div>
                                    <p className="text-xs text-muted-foreground">all time</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🕒 Recent Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentAttendance.length > 0 ? (
                                    recentAttendance.map((record) => (
                                        <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">
                                                    {record.type === 'check_in' ? '🟢' : '🔴'}
                                                </span>
                                                <div>
                                                    <p className="font-medium">
                                                        {isAdmin && record.user ? record.user.name : 
                                                         record.type === 'check_in' ? 'Check In' : 'Check Out'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(record.recorded_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            {record.location_address && (
                                                <Badge variant="outline" className="text-xs">
                                                    📍 Located
                                                </Badge>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No attendance records yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {isAdmin && todayCheckIns && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    ✅ Today's Check-ins
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {todayCheckIns.length > 0 ? (
                                        todayCheckIns.map((record) => (
                                            <div key={record.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">👤</span>
                                                    <div>
                                                        <p className="font-medium">{record.user?.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {formatTime(record.recorded_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {record.location_address && (
                                                    <Badge variant="outline" className="text-xs bg-green-100">
                                                        📍 Located
                                                    </Badge>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No check-ins today</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}