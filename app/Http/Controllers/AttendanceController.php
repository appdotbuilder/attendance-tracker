<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            // Admin sees all attendance records
            $records = AttendanceRecord::with('user')
                ->latest('recorded_at')
                ->paginate(20);
        } else {
            // Employee sees only their own records
            $records = $user->attendanceRecords()
                ->latest('recorded_at')
                ->paginate(20);
        }

        return Inertia::render('attendance/index', [
            'records' => $records,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $user = auth()->user();
        
        // Check if user already has a check-in today without check-out
        if ($request->type === 'check_in') {
            $hasOpenCheckIn = AttendanceRecord::where('user_id', $user->id)
                ->whereDate('recorded_at', today())
                ->where('type', 'check_in')
                ->whereDoesntHave('user.attendanceRecords', function ($query) {
                    $query->where('type', 'check_out')
                        ->whereDate('recorded_at', today())
                        ->whereRaw('recorded_at > (SELECT MAX(recorded_at) FROM attendance_records WHERE type = "check_in" AND user_id = ? AND DATE(recorded_at) = ?)', [auth()->id(), today()]);
                })
                ->exists();

            if ($hasOpenCheckIn) {
                return back()->withErrors(['type' => 'You already have an active check-in for today. Please check-out first.']);
            }
        }

        // Check if user is trying to check-out without checking in
        if ($request->type === 'check_out') {
            $hasCheckInToday = AttendanceRecord::where('user_id', $user->id)
                ->whereDate('recorded_at', today())
                ->where('type', 'check_in')
                ->exists();

            if (!$hasCheckInToday) {
                return back()->withErrors(['type' => 'You must check-in first before checking out.']);
            }
        }

        AttendanceRecord::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'recorded_at' => now(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_address' => $request->location_address,
        ]);

        $message = $request->type === 'check_in' ? 'Checked in successfully!' : 'Checked out successfully!';
        
        return back()->with('success', $message);
    }
}