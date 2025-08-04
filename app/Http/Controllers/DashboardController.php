<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }
        
        return $this->employeeDashboard();
    }

    /**
     * Display the admin dashboard.
     */
    protected function adminDashboard()
    {
        $totalEmployees = User::employees()->count();
        $totalAdmins = User::admins()->count();
        $todayAttendance = AttendanceRecord::today()->count();
        $totalAttendanceRecords = AttendanceRecord::count();
        
        // Recent attendance records
        $recentAttendance = AttendanceRecord::with('user')
            ->latest('recorded_at')
            ->take(10)
            ->get();
        
        // Today's check-ins
        $todayCheckIns = AttendanceRecord::with('user')
            ->today()
            ->checkIns()
            ->latest('recorded_at')
            ->get();

        return Inertia::render('dashboard', [
            'isAdmin' => true,
            'stats' => [
                'totalEmployees' => $totalEmployees,
                'totalAdmins' => $totalAdmins,
                'todayAttendance' => $todayAttendance,
                'totalAttendanceRecords' => $totalAttendanceRecords,
            ],
            'recentAttendance' => $recentAttendance,
            'todayCheckIns' => $todayCheckIns,
        ]);
    }

    /**
     * Display the employee dashboard.
     */
    protected function employeeDashboard()
    {
        $user = auth()->user();
        
        // Get today's attendance status
        $todayCheckIn = AttendanceRecord::where('user_id', $user->id)
            ->today()
            ->checkIns()
            ->latest('recorded_at')
            ->first();
            
        $todayCheckOut = AttendanceRecord::where('user_id', $user->id)
            ->today()
            ->checkOuts()
            ->latest('recorded_at')
            ->first();
        
        // Recent attendance records
        $recentAttendance = $user->attendanceRecords()
            ->latest('recorded_at')
            ->take(10)
            ->get();
        
        // This month's attendance count
        $monthlyAttendance = AttendanceRecord::where('user_id', $user->id)
            ->whereMonth('recorded_at', now()->month)
            ->whereYear('recorded_at', now()->year)
            ->where('type', 'check_in')
            ->count();

        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'todayStatus' => [
                'hasCheckedIn' => (bool) $todayCheckIn,
                'hasCheckedOut' => (bool) $todayCheckOut,
                'checkInTime' => $todayCheckIn?->recorded_at,
                'checkOutTime' => $todayCheckOut?->recorded_at,
            ],
            'stats' => [
                'monthlyAttendance' => $monthlyAttendance,
                'totalAttendanceRecords' => $user->attendanceRecords()->count(),
            ],
            'recentAttendance' => $recentAttendance,
        ]);
    }
}