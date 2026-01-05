# Timer Functionality - Complete Guide

## Overview

The timer functionality provides buzzer-style time tracking with automatic task switching, pause/resume, and real-time updates.

## Features

### 1. Start Timer (Buzzer-Style)
- Click any category button on a project card
- Timer starts immediately
- Active timer appears at the top
- Live countdown (HH:MM:SS format)
- Auto-switches if you click a different task

### 2. Auto Task Switching
- If a timer is already running and you click a different task:
  - Current task stops automatically
  - Time entry is saved with "Auto-saved when switching tasks" description
  - New timer starts immediately
  - Seamless transition

### 3. Pause/Resume
- **Pause**: Temporarily stops the timer
  - Border changes from green to yellow
  - Status shows "PAUSED"
  - Paused time is tracked separately
  - Pause button becomes Resume button
- **Resume**: Continues the timer
  - Excludes paused duration from total time
  - Border returns to green
  - Status shows "ACTIVE"

### 4. Stop Timer with Description
- Click "Stop" button
- Modal appears prompting for description
- Enter what you worked on
- Time entry is created and saved
- Timer is removed
- Entry appears in "Today's Summary"

### 5. Real-Time Updates
- Live timer counting every second
- Animated pulse on active indicator
- Responsive UI updates
- Data refreshes after operations

### 6. Loading States
- Buttons disabled while operations in progress
- Visual feedback during API calls
- Prevents duplicate operations

### 7. Error Handling
- Error messages displayed at top of page
- Dismissible error notifications
- Console logging for debugging
- Graceful error recovery

## Architecture

```
User Action
    ↓
React Component (Dashboard.tsx)
    ↓
Inertia.js Router
    ↓
Laravel Controller (TimerController)
    ↓
Eloquent Model (ActiveTimer)
    ↓
Database (MySQL/SQLite)
    ↓
JSON Response
    ↓
UI Update + Data Refresh
```

## Database Operations

**tt_active_timers table:**
- Stores currently running timer (one per user)
- Tracks start time, paused duration, status
- Deleted when timer stops

**tt_time_entries table:**
- Permanent record of completed work
- Automatically calculates duration and total amount
- Includes description, project, category info

## API Endpoints

### POST /time-tracker/timer/start
```json
Request: { "project_id": "uuid", "category_id": "uuid" }
Response: { "timer": { ...timerData } }
```
- Stops any existing timer
- Creates new active_timers record
- Returns timer with project/category details

### POST /time-tracker/timer/stop
```json
Request: { "description": "What you worked on" }
Response: { "entry": { ...timeEntryData } }
```
- Calculates total duration (excluding paused time)
- Creates time_entries record
- Deletes active_timers record
- Returns created entry

### POST /time-tracker/timer/pause
```json
Request: {}
Response: { "timer": { ...timerData } }
```
- Updates timer status to "paused"
- Records paused_at timestamp
- Returns updated timer

### POST /time-tracker/timer/resume
```json
Request: {}
Response: { "timer": { ...timerData } }
```
- Calculates paused duration
- Adds to total paused_duration
- Updates status to "running"
- Clears paused_at
- Returns updated timer

## Usage Examples

### Scenario 1: Basic Time Tracking
```
1. Click "Website Redesign - Development"
   → Timer starts

2. Work for 1 hour 23 minutes
   → Timer shows 01:23:15

3. Click "Stop"
   → Modal appears

4. Enter: "Implemented new navigation component"
   → Entry saved: 1.39 hours @ CHF 150 = CHF 208.50
```

### Scenario 2: Taking a Break
```
1. Timer running: 00:45:30
2. Click "Pause" (going to lunch)
   → Timer pauses, border turns yellow

3. Come back 30 minutes later
4. Click "Resume"
   → Timer continues from 00:45:30
   → 30 minute break not counted
```

### Scenario 3: Switching Tasks
```
1. Working on "Website Redesign - Development"
   → Timer: 00:32:15

2. Click "Mobile App - iOS Development" (urgent task)
   → Development task auto-saved (0.54 hours)
   → iOS timer starts at 00:00:00

3. Both entries in today's summary
```

## Code Structure

### Controllers

**TimerController.php** (`src/Http/Controllers/`)
- `start()` - Start timer, auto-stop previous
- `stop()` - Stop timer, create entry
- `pause()` - Pause active timer
- `resume()` - Resume paused timer

### Models

**ActiveTimer.php** (`src/Models/`)
- `pause()` - Set status to paused
- `resume()` - Resume and accumulate pause time
- `stop($description)` - Create entry and delete timer
- `elapsed_seconds` accessor - Calculate elapsed time
- `elapsed_hours` accessor - Convert to decimal hours

### React Components

**Dashboard.tsx** (`resources/js/Pages/TimeTracker/`)
- Main dashboard with state management
- Handles all timer operations

**ActiveTimer.tsx** (`resources/js/Components/TimeTracker/`)
- Displays running/paused timer
- Real-time countdown using setInterval

**ProjectCard.tsx** (`resources/js/Components/TimeTracker/`)
- Project card with category buttons
- Click to start timer

**StopTimerModal.tsx** (`resources/js/Components/TimeTracker/`)
- Modal for entering description when stopping

## State Management

```typescript
// Active timer state
const [activeTimer, setActiveTimer] = useState(initialActiveTimer);

// Today's entries
const [todayEntries, setTodayEntries] = useState(initialTodayEntries);

// UI state
const [isStopModalOpen, setIsStopModalOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## Timer Calculation

```typescript
// In ActiveTimer.tsx
const startTime = new Date(timer.started_at).getTime();
const pausedDuration = timer.paused_duration || 0;
const now = Date.now();

// Elapsed time (excluding paused duration)
const totalElapsed = Math.floor(
  (now - startTime - pausedDuration * 1000) / 1000
);
```

## Troubleshooting

### Timer not starting
**Check:**
1. Console for errors
2. Network tab in DevTools
3. User is authenticated
4. Database connection
5. Run `php artisan route:list` to verify routes

### Timer not stopping
**Check:**
1. Modal appears?
2. Console errors?
3. Database connection?
4. Check `php artisan pail` for server logs

### Wrong duration calculated
**Check:**
1. Timezone settings in `config/app.php`
2. Paused duration tracking
3. Model calculations in `ActiveTimer.php`
4. Check entries directly in database

### Auto-switch not working
**Check:**
1. Previous entry created in tt_time_entries?
2. Old timer deleted from tt_active_timers?
3. New timer created?
4. Console for errors

## Testing

### Test 1: Start and Stop
1. Start dev server: `composer dev`
2. Navigate to dashboard
3. Click a category button
4. Verify timer appears and counts
5. Click Stop
6. Enter description
7. Verify entry in Today's Summary

### Test 2: Pause and Resume
1. Start a timer
2. Wait 10 seconds
3. Click Pause
4. Wait 10 seconds (timer should NOT increase)
5. Click Resume
6. Verify timer continues from paused point

### Test 3: Task Switching
1. Start timer on Task A
2. Wait 30 seconds
3. Click different task (Task B)
4. Verify Task A entry created
5. Verify Task B timer started
6. Check both in Today's Summary

## Performance Notes

- Timer updates every 1 second (local calculation)
- API calls only on start/stop/pause/resume
- No database polling
- Efficient React re-renders
- Uses Inertia.js for SPA-like experience

## Database Impact

**Storage per entry:**
- ~1KB per time entry
- Minimal storage footprint
- Indexes on user_id, date, project_id

**Queries:**
- Active timer: Single-row lookup by user_id (unique constraint)
- Today's entries: Date-indexed query
- Fast even with thousands of entries
