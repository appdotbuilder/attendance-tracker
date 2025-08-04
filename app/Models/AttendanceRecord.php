<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AttendanceRecord
 *
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property \Illuminate\Support\Carbon $recorded_at
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $location_address
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord query()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereLocationAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereRecordedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord checkIns()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord checkOuts()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceRecord today()
 * @method static \Database\Factories\AttendanceRecordFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class AttendanceRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'recorded_at',
        'latitude',
        'longitude',
        'location_address',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'recorded_at' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the user that owns the attendance record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include check-in records.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCheckIns($query)
    {
        return $query->where('type', 'check_in');
    }

    /**
     * Scope a query to only include check-out records.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCheckOuts($query)
    {
        return $query->where('type', 'check_out');
    }

    /**
     * Scope a query to only include today's records.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeToday($query)
    {
        return $query->whereDate('recorded_at', today());
    }
}