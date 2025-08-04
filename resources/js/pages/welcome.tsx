import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Attendance Management System" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-16">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            📍 Smart Attendance System
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Modern GPS-enabled attendance tracking for your organization. 
                            Real-time check-ins, comprehensive reporting, and seamless user management.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="text-3xl mb-2">🌍</div>
                                <CardTitle>GPS Location Tracking</CardTitle>
                                <CardDescription>
                                    Accurate location recording for every check-in and check-out
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Real-time GPS coordinates</li>
                                    <li>• Address verification</li>
                                    <li>• Location history tracking</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="text-3xl mb-2">👥</div>
                                <CardTitle>Role-Based Access</CardTitle>
                                <CardDescription>
                                    Separate dashboards for employees and administrators
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Employee self-service</li>
                                    <li>• Admin management tools</li>
                                    <li>• Secure user authentication</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="text-3xl mb-2">📊</div>
                                <CardTitle>Smart Analytics</CardTitle>
                                <CardDescription>
                                    Comprehensive reporting and attendance insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Real-time dashboards</li>
                                    <li>• Attendance statistics</li>
                                    <li>• Export capabilities</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Screenshots/Demo Section */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            How It Works
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">1. Easy Check-In</h3>
                                <p className="text-gray-600 text-sm">
                                    Employees tap to check-in with automatic GPS location capture
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">2. Location Verified</h3>
                                <p className="text-gray-600 text-sm">
                                    System records precise GPS coordinates and address information
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📈</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">3. Real-time Reports</h3>
                                <p className="text-gray-600 text-sm">
                                    Admins get instant access to attendance data and analytics
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                        {auth.user ? (
                            <div className="space-y-4">
                                <p className="text-lg text-gray-700 mb-6">
                                    Welcome back, <strong>{auth.user.name}</strong>! 
                                    {auth.user.role === 'admin' ? ' 👑' : ' 👋'}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Link href="/dashboard">
                                        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/attendance">
                                        <Button size="lg" variant="outline">
                                            View Attendance
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Ready to streamline your attendance tracking?
                                </h2>
                                <div className="flex justify-center gap-4">
                                    <Link href="/login">
                                        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="lg" variant="outline">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Join organizations already using our smart attendance system
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}