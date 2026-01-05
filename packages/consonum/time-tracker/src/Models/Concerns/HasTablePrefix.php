<?php

namespace Consonum\TimeTracker\Models\Concerns;

trait HasTablePrefix
{
    protected static string $tableBaseName = '';

    public function getTable(): string
    {
        if (isset($this->table) && $this->table) {
            // Only add prefix if not already present
            $prefix = config('time-tracker.table_prefix', 'tt_');
            if (!str_starts_with($this->table, $prefix)) {
                return $prefix . $this->table;
            }
            return $this->table;
        }

        return parent::getTable();
    }
}
