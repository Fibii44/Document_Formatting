<?php

namespace App\Exports;

use App\Traits\HasReportMapping;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TemplateExcelExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    use HasReportMapping;

    protected $users;
    protected $template;

    public function __construct($users, $template)
    {
        $this->users = $users;
        $this->template = $template;
    }

    public function collection()
    {
        return $this->users;
    }

    public function headings(): array
    {
        // For Text type, we use defaults. For Upload, we use the custom mappings.
        if ($this->template->type === 'text') {
            return ['Employee Name', 'Role', 'Department', 'Monthly Salary'];
        }

        return array_map(fn($m) => str_replace('@', '', $m['tag']), $this->template->field_mappings ?? []);
    }

    public function map($user): array
    {
        $row = [];
        $tags = $this->template->type === 'text' 
            ? ['@Full Name (First MI Last)', '@Role', '@Department', '@Monthly Salary']
            : array_column($this->template->field_mappings ?? [], 'tag');

        foreach ($tags as $tag) {
            $row[] = $this->getMappingValue($tag, $user);
        }
        return $row;
    }
}