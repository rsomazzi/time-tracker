# Reports & Time Entry Management - Complete Guide

## Overview

The reports feature provides comprehensive time entry management with filtering, editing, deletion, and CSV export capabilities.

## Features

### 1. Reports Page (/time-tracker/reports)

**Access:** Click "View Reports" button in dashboard header

**Features:**
- Date range selector (custom dates)
- Quick filters: 7 Days, 30 Days, This Month, Last Month
- Project filter (all projects or specific one)
- Export to CSV button
- Real-time calculations

### 2. Summary Cards

**Overall Summary:**
- Total hours worked
- Total amount earned (CHF)
- Average hourly rate

**By Project:**
- Hours per project
- Amount per project
- Color-coded indicators

**By Category:**
- Hours per category
- Amount per category
- Grid layout for easy viewing

### 3. Time Entries Table

**Columns:**
- Date
- Time (start - end)
- Duration (hours)
- Project (with color indicator)
- Category (code - name)
- Description
- Hourly rate (CHF)
- Total amount (CHF)
- Actions (Edit/Delete buttons)

**Features:**
- Sortable by date
- Scrollable for long lists
- Hover effects
- Responsive design

### 4. Edit Time Entry

**How to Edit:**
1. Click "Edit" button on any entry
2. Modal opens with pre-filled data
3. Modify any fields:
   - Date
   - Start time
   - End time
   - Project (dropdown)
   - Category (auto-loads for selected project)
   - Description
4. Click "Save Changes"
5. Entry updates immediately
6. Duration and total recalculated automatically

**Validation:**
- Date required
- Start time required
- End time required
- Project required
- End time must be after start time

### 5. Delete Time Entry

**How to Delete:**
1. Click "Delete" button on any entry
2. Confirmation modal appears showing:
   - Date
   - Project
   - Duration
   - Amount
3. Click "Delete Entry" to confirm
4. Entry removed immediately
5. Totals recalculated

**Safety:**
- Cannot be undone warning
- Confirmation required
- Shows what will be deleted

### 6. CSV Export

**Export Format:**
- Headers: Date, Start Time, End Time, Duration, Project, Category, Description, Rate, Total
- All visible entries included
- Properly quoted fields
- Ready for Excel/Google Sheets
- Filename: `time-report-YYYY-MM-DD-to-YYYY-MM-DD.csv`

**How to Export:**
1. Filter data as desired
2. Click "Export CSV" button
3. File downloads automatically
4. Open in any spreadsheet app

## Usage Examples

### Example 1: Weekly Report

```
1. Navigate to /time-tracker/reports
2. Click "7 Days"
   → Shows last 7 days
3. Review summary:
   → Total: 38.5h
   → Amount: CHF 6,545.00
4. Export to CSV for backup
```

### Example 2: Monthly Invoice Preparation

```
1. Navigate to /time-tracker/reports
2. Click "Last Month"
3. Filter by Project: "Website Redesign"
4. Review all entries
5. Verify accuracy
6. Export CSV
7. Use for invoice creation
```

### Example 3: Edit Incorrect Entry

```
1. Find entry with wrong time
2. Click "Edit"
3. Change end time from 16:00 to 17:30
4. Save
   → Duration updates: 1.5h → 3.0h
   → Total updates: CHF 225 → CHF 450
```

### Example 4: Delete Duplicate

```
1. Find duplicate entry
2. Click "Delete"
3. Confirm deletion
   → Entry removed
   → Today's summary updates
```

## Date Range Shortcuts

**7 Days:**
- Last 7 days from today
- Useful for quick review

**30 Days:**
- Last 30 days from today
- Useful for monthly overview

**This Month:**
- 1st to current day of current month
- Useful for ongoing monthly reports

**Last Month:**
- Full previous month
- Useful for invoicing

**Custom:**
- Pick any start and end date
- Useful for specific periods

## API Endpoints

### GET /time-tracker/entries
```
Query Params:
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD
- project_id: uuid (optional)

Returns:
- entries: Array of time entries with project/category details
```

### PUT /time-tracker/entries/{id}
```
Body:
- date: YYYY-MM-DD
- start_time: HH:MM:SS
- end_time: HH:MM:SS
- project_id: uuid
- category_id: uuid (optional)
- description: string

Returns:
- entry: Updated entry with recalculated duration/total
```

### DELETE /time-tracker/entries/{id}
```
Returns:
- success: true
```

### GET /time-tracker/projects/{id}/categories
```
Returns:
- categories: Array of categories for the project
```

## Database Operations

**When you edit an entry:**
1. Validates user owns the entry
2. Fetches new project's hourly rate
3. Updates entry in database
4. Model automatically recalculates:
   - duration_hours (based on start/end time)
   - total_amount (hours × rate)
5. Returns updated entry

**When you delete an entry:**
1. Validates user owns the entry
2. Permanently deletes from database
3. Cannot be recovered

## Component Structure

```
Reports.tsx (page)
├── DateRangeSelector (date picker + shortcuts)
├── ReportSummary (summary cards)
├── TimeEntriesTable (data table)
├── EditEntryModal (edit form) - planned
└── DeleteConfirmModal (delete confirmation) - integrated
```

## State Management

```typescript
// Filters
const [startDate, setStartDate] = useState(defaultStartDate);
const [endDate, setEndDate] = useState(defaultEndDate);
const [selectedProject, setSelectedProject] = useState<string | null>(null);

// Data
const [entries, setEntries] = useState([]);
const [summary, setSummary] = useState({});

// UI
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [editingEntry, setEditingEntry] = useState(null);
const [deletingEntry, setDeletingEntry] = useState(null);
```

## Testing Checklist

**Date Filtering:**
- [ ] 7 Days shows correct range
- [ ] 30 Days shows correct range
- [ ] This Month shows correct dates
- [ ] Last Month shows correct dates
- [ ] Custom dates work
- [ ] Entries filter correctly

**Project Filtering:**
- [ ] "All Projects" shows everything
- [ ] Specific project filters correctly
- [ ] Combined with date range works

**Edit Entry:**
- [ ] Modal opens with correct data
- [ ] Can change all fields
- [ ] Categories update when project changes
- [ ] Duration recalculates
- [ ] Total recalculates
- [ ] Changes persist after save
- [ ] Can cancel without saving

**Delete Entry:**
- [ ] Confirmation modal appears
- [ ] Shows correct entry details
- [ ] Can cancel
- [ ] Entry deletes on confirm
- [ ] Totals update after delete
- [ ] Dashboard updates

**CSV Export:**
- [ ] Button works
- [ ] CSV downloads correctly
- [ ] Data matches table
- [ ] Opens in Excel/Sheets
- [ ] Filename is correct

**Summary Calculations:**
- [ ] Total hours correct
- [ ] Total amount correct
- [ ] By project breakdown correct
- [ ] By category breakdown correct
- [ ] Updates after edit/delete

## Troubleshooting

### Entries not loading
**Check:**
1. Console for errors
2. Network tab - API call successful?
3. Date range valid?
4. User has entries in that period?
5. Check `php artisan pail` for server errors

### Edit not saving
**Check:**
1. All required fields filled?
2. End time after start time?
3. Project has hourly rate set?
4. Console for errors?

### Delete not working
**Check:**
1. User owns the entry?
2. Foreign key constraints?
3. Network errors?

### CSV export empty
**Check:**
1. Entries array has data?
2. Browser blocking downloads?
3. Check downloads folder

### Totals incorrect
**Check:**
1. Model mutators working?
2. Hourly rates set on projects?
3. Duration calculation correct?

## Excel Format Matching

The reports match standard timesheet formats:

| Column | Description |
|--------|-------------|
| Date | Entry date |
| Start Time | When work started |
| End Time | When work ended |
| Duration | Hours worked (decimal) |
| Project | Project name |
| Category | Category code and name |
| Description | Work description |
| Rate | Hourly rate (CHF) |
| Total | Amount earned (CHF) |

**Summary Section:**
- Total hours = Overall Summary
- Category totals = By Category summary
- Project totals = By Project summary

## Performance Notes

**Queries optimized:**
- Index on user_id, date, project_id
- Eager loading of relationships
- No N+1 queries
- Fast even with 1000+ entries

**UI optimized:**
- Conditional rendering
- Efficient re-renders
- Loading states
- Error boundaries

## Navigation

**From Dashboard → Reports:**
- Click "View Reports" button

**From Reports → Dashboard:**
- Click "← Dashboard" link

**Quick Access:**
- Bookmark `/time-tracker/reports` for direct access

## Mobile Responsiveness

**Table:**
- Horizontal scroll on small screens
- Touch-friendly edit/delete buttons
- Optimized column widths

**Filters:**
- Stack vertically on mobile
- Large tap targets
- Easy date picker

**Modals:**
- Full screen on mobile
- Large form fields
- Easy to fill out

## Security

**Authorization:**
- Users can only see/edit/delete their own entries
- Enforced at controller level
- Policy checks on all operations

**Validation:**
- Server-side validation on all operations
- Type checking with TypeScript
- SQL injection prevention via Eloquent

**Audit Trail:**
- created_at and updated_at tracked
- Could add audit log for deletions
