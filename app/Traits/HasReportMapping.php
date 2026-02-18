<?php

namespace App\Traits;

use Carbon\Carbon;

trait HasReportMapping
{
    /**
     * Shared logic for formatting employee data based on tags.
     */
    public function getMappingValue($tag, $employee)
    {
        $bonus = $employee->bonus_total ?? 0;
        $exemptBonus = min($bonus, 90000);
        $taxableBonus = max(0, $bonus - 90000);
        $totalStatutory = ($employee->sss_contri ?? 0) + ($employee->ph_contri ?? 0) + ($employee->pi_contri ?? 0);

        return match ($tag) {
            '@Full Name (First MI Last)' => strtoupper("{$employee->first_name} {$employee->middle_initial} {$employee->last_name}"),
            '@Full Name (Last, First MI)' => strtoupper("{$employee->last_name}, {$employee->first_name} {$employee->middle_initial}"),
            '@Full Name (Last, First)'    => strtoupper("{$employee->last_name}, {$employee->first_name}"),
            '@Middle Name'   => strtoupper($employee->middle_name),
            '@TIN'           => $employee->tin_number,
            '@Role'          => strtoupper($employee->role),
            '@Department'    => strtoupper($employee->department),
            '@Email'         => $employee->email,
            '@Join Date'     => $employee->join_date ? Carbon::parse($employee->join_date)->format('M d, Y') : '',
            '@Monthly Salary'=> number_format($employee->salary ?? 0, 2),
            '@Holiday Pay'   => number_format($employee->holiday_pay ?? 0, 2),
            '@Overtime Pay'  => number_format($employee->overtime_pay ?? 0, 2),
            '@Hazard Pay'    => number_format($employee->hazard_pay ?? 0, 2),
            '@MWE Status'    => $employee->is_mwe ? 'YES' : 'NO',
            '@Exempt Bonus'  => number_format($exemptBonus, 2),
            '@Taxable Bonus' => number_format($taxableBonus, 2),
            '@Total Contributions' => number_format($totalStatutory, 2),
            default => '',
        };
    }
}