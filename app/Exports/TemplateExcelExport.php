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

    /**
     * Helper to find which @tags exist inside the text editor content.
     */
    private function getTagsFromContent(): array
    {
        $allPossibleTags = [
            '@Full Name (First MI Last)', '@Full Name (Last, First MI)', 
            '@Full Name (Last, First)', '@Middle Name', '@TIN', '@Role', 
            '@Department', '@Email', '@Join Date', '@Monthly Salary', 
            '@Holiday Pay', '@Overtime Pay', '@Hazard Pay', '@MWE Status', 
            '@Exempt Bonus', '@Taxable Bonus', '@Total Contributions', '@Employee Name'
        ];

        $content = $this->template->content ?? '';
        $usedTags = [];

        foreach ($allPossibleTags as $tag) {
            if (str_contains($content, $tag)) {
                $usedTags[] = $tag;
            }
        }

        return $usedTags;
    }

    public function collection()
    {
        return $this->users;
    }

    public function headings(): array
    {
        if ($this->template->type === 'text') {
            $tags = $this->getTagsFromContent();
            return array_map(fn($tag) => str_replace('@', '', $tag), $tags);
        }

        // For Upload type, use custom field_mappings
        return array_map(
            fn($m) => str_replace('@', '', $m['tag']), 
            $this->template->field_mappings ?? []
        );
    }

    public function map($user): array
    {
        $row = [];
        
        // Get the list of tags to process
        if ($this->template->type === 'text') {
            $tags = $this->getTagsFromContent();
        } else {
            $tags = array_column($this->template->field_mappings ?? [], 'tag');
        }

        foreach ($tags as $tag) {
            $row[] = $this->getMappingValue($tag, $user);
        }
        
        return $row;
    }
}