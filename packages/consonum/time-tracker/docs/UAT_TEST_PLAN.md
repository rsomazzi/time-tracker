# UAT Test Plan - Time Tracker (Laravel)

**Version:** 2.0
**Platform:** Laravel 12 + Inertia.js + React
**Project:** Consonum Time Tracker

---

## 1. Executive Summary

### Purpose
This document outlines the User Acceptance Testing (UAT) plan for the Time Tracker Laravel application.

### Scope
UAT covers:
- Authentication (Laravel built-in)
- Timer Functionality (Start/Stop/Pause/Resume)
- Time Entry Management (View/Edit/Delete)
- Reports and Exports

### Out of Scope
- Invoice generation and Swiss QR-bill
- Admin interface (user/project/customer management)
- Mobile apps (iOS/Android)

---

## 2. Test Environment Setup

### Prerequisites

#### 2.1 System Requirements
- PHP 8.2+
- Composer 2.x
- Node.js 18+
- MySQL 8.0+ or SQLite

#### 2.2 Installation

```bash
# Clone repository
git clone [repository-url]
cd time-tracker-laravel

# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_DATABASE=time_tracker_uat
DB_USERNAME=your_user
DB_PASSWORD=your_password

# Run migrations and seed
php artisan migrate:fresh --seed

# Build assets
npm run build
```

#### 2.3 Test Data (Created by Seeder)

**Company:** Consonum GmbH

**Customers:**
- ABC AG
- XYZ GmbH

**Projects:**
| Project | Customer | Rate (CHF) | Color |
|---------|----------|------------|-------|
| Website Redesign | ABC AG | 150.00 | Blue |
| Mobile App | XYZ GmbH | 175.00 | Green |
| API Integration | ABC AG | 160.00 | Orange |

**Categories per Project:**
- Website Redesign: Development, Design, Project Management
- Mobile App: iOS Development, Android Development, QA
- API Integration: Integration, Documentation

#### 2.4 Test User

**Demo User:**
- Email: `demo@example.com`
- Password: `password`

#### 2.5 Start Application

```bash
# Development mode (all services)
composer dev

# Or manually
php artisan serve
npm run dev
```

Access at: http://localhost:8000

---

## 3. Test Scenarios

### 3.1 Authentication Tests

#### TC-AUTH-001: Login - Happy Path
**Objective:** Verify user can log in with valid credentials

**Steps:**
1. Navigate to http://localhost:8000
2. Enter email: `demo@example.com`
3. Enter password: `password`
4. Click "Login" button

**Expected Result:**
- User logged in successfully
- Redirected to `/time-tracker`
- Dashboard displays projects

**Priority:** HIGH

---

#### TC-AUTH-002: Login - Invalid Credentials
**Objective:** Verify error handling for invalid credentials

**Steps:**
1. Navigate to login page
2. Enter email: `demo@example.com`
3. Enter password: `wrongpassword`
4. Click "Login"

**Expected Result:**
- Error message displayed
- User remains on login page
- No session created

**Priority:** MEDIUM

---

#### TC-AUTH-003: Logout
**Objective:** Verify user can sign out

**Steps:**
1. Log in as demo user
2. Navigate to dashboard
3. Click "Logout" button
4. Attempt to navigate to `/time-tracker`

**Expected Result:**
- User logged out
- Redirect to login page
- Cannot access dashboard without re-login

**Priority:** HIGH

---

### 3.2 Timer Functionality Tests

#### TC-TIMER-001: Start Timer
**Objective:** Verify timer can be started on a category

**Preconditions:**
- User logged in
- No active timer running

**Steps:**
1. Navigate to dashboard
2. Locate "Website Redesign" project card
3. Click "Development" category button

**Expected Result:**
- Active timer section appears at top
- Timer displays "00:00:00" initially
- Timer starts counting up
- Project name and category displayed
- Pause and Stop buttons enabled

**Priority:** CRITICAL

---

#### TC-TIMER-002: Pause Timer
**Objective:** Verify timer can be paused

**Preconditions:**
- Timer running

**Steps:**
1. Let timer run for 30 seconds
2. Click "Pause" button
3. Wait 10 seconds
4. Verify timer is still paused

**Expected Result:**
- Timer stops counting
- Time frozen at pause moment
- Pause button changes to "Resume"
- Stop button remains enabled
- Visual indicator shows paused state (yellow)

**Priority:** HIGH

---

#### TC-TIMER-003: Resume Timer
**Objective:** Verify paused timer can be resumed

**Preconditions:**
- Timer paused

**Steps:**
1. Note the paused time
2. Click "Resume" button
3. Verify timer continues

**Expected Result:**
- Timer resumes counting from paused time
- Resume button changes to "Pause"
- Paused time NOT included in elapsed time

**Priority:** HIGH

---

#### TC-TIMER-004: Stop Timer and Save Entry
**Objective:** Verify timer can be stopped and entry saved

**Preconditions:**
- Timer running for at least 1 minute

**Steps:**
1. Click "Stop" button
2. Modal appears with description field
3. Enter description: "UAT Test - Development work"
4. Click "Save" button
5. Check "Today's Summary" section

**Expected Result:**
- Modal appears with description input
- After clicking Save:
  - Active timer section disappears
  - Today's Summary shows the new entry
  - Entry displays: project, category, duration, description
  - Duration matches timer time (excluding paused time)

**Priority:** CRITICAL

---

#### TC-TIMER-005: Auto-Switch Between Tasks
**Objective:** Verify starting new timer auto-saves previous timer

**Preconditions:**
- Timer running on "Development"

**Steps:**
1. Start timer on "Development" category
2. Let run for 2 minutes
3. Click "Design" category button (same or different project)
4. Check Today's Summary

**Expected Result:**
- Previous entry saved automatically
- New timer starts immediately
- Both entries visible in Today's Summary

**Priority:** CRITICAL

---

#### TC-TIMER-006: Timer with Multiple Pauses
**Objective:** Verify pause duration is correctly excluded

**Steps:**
1. Start timer
2. Let run for 1 minute
3. Pause for 30 seconds
4. Resume, run for 1 minute
5. Pause for 20 seconds
6. Resume, run for 30 seconds
7. Stop timer

**Expected Result:**
- Total duration = 2 minutes 30 seconds
- Paused time (50 seconds) NOT included
- Entry saved with correct duration

**Priority:** HIGH

---

#### TC-TIMER-007: One Active Timer Per User
**Objective:** Verify only one timer can be active

**Steps:**
1. Start timer on Task A
2. Open second browser tab
3. View dashboard in both tabs

**Expected Result:**
- Same active timer visible in both tabs
- Only one entry in tt_active_timers table
- Starting new timer in either tab stops the other

**Priority:** MEDIUM

---

### 3.3 Time Entry Management Tests

#### TC-ENTRY-001: View Time Entries in Reports
**Objective:** Verify entries can be viewed

**Preconditions:**
- At least 3 time entries exist

**Steps:**
1. Navigate to `/time-tracker/reports`
2. Verify default date range
3. View list of entries

**Expected Result:**
- Reports page displays entries
- Each entry shows all details
- Summary cards show totals

**Priority:** HIGH

---

#### TC-ENTRY-002: Filter by Date Range
**Objective:** Verify date filtering works

**Steps:**
1. Navigate to reports
2. Select custom date range
3. Apply filter

**Expected Result:**
- Only entries in range displayed
- Summary totals recalculated

**Priority:** HIGH

---

#### TC-ENTRY-003: Quick Date Filters
**Objective:** Verify shortcuts work

**Steps:**
1. Click "7 Days"
2. Click "30 Days"
3. Click "This Month"
4. Click "Last Month"

**Expected Result:**
- Each shortcut sets correct date range
- Entries filter correctly

**Priority:** MEDIUM

---

#### TC-ENTRY-004: Filter by Project
**Objective:** Verify project filtering works

**Steps:**
1. Select "Website Redesign" from dropdown
2. Verify only those entries shown
3. Select "All Projects"
4. Verify all entries shown

**Expected Result:**
- Project filter works correctly
- Combines with date filter

**Priority:** MEDIUM

---

#### TC-ENTRY-005: Edit Time Entry
**Objective:** Verify entry can be edited

**Steps:**
1. Click "Edit" on an entry
2. Change start time from 09:00 to 10:00
3. Change end time from 11:00 to 12:30
4. Save changes

**Expected Result:**
- Edit modal opens with data
- After saving:
  - Duration recalculates: 2.5 hours
  - Total amount recalculates
  - Changes persist

**Priority:** HIGH

---

#### TC-ENTRY-006: Delete Time Entry
**Objective:** Verify entry can be deleted

**Steps:**
1. Click "Delete" on an entry
2. Confirmation appears
3. Click "Delete" to confirm

**Expected Result:**
- Confirmation shows entry details
- After confirming:
  - Entry removed
  - Totals recalculate

**Priority:** HIGH

---

### 3.4 Export Tests

#### TC-EXPORT-001: Export to CSV
**Objective:** Verify CSV export works

**Steps:**
1. Filter entries as desired
2. Click "Export CSV"
3. Open downloaded file

**Expected Result:**
- CSV downloads
- Contains all filtered entries
- Opens correctly in Excel

**Priority:** MEDIUM

---

### 3.5 Data Accuracy Tests

#### TC-DATA-001: Duration Calculation
**Test Cases:**
| Start | End | Expected Duration |
|-------|-----|-------------------|
| 09:00 | 10:00 | 1.00 hours |
| 09:15 | 10:45 | 1.50 hours |
| 08:30 | 12:45 | 4.25 hours |

**Priority:** CRITICAL

---

#### TC-DATA-002: Total Amount Calculation
**Test Cases:**
| Duration | Rate | Expected Total |
|----------|------|----------------|
| 2.5h | 150 CHF | 375.00 CHF |
| 1.75h | 180 CHF | 315.00 CHF |
| 0.5h | 120 CHF | 60.00 CHF |

**Priority:** CRITICAL

---

#### TC-DATA-003: Summary Accuracy
**Objective:** Verify totals are correct

Create entries:
- Entry 1: 2.0h × 150 = 300 CHF
- Entry 2: 1.5h × 150 = 225 CHF
- Entry 3: 3.0h × 180 = 540 CHF

**Expected:**
- Total hours: 6.5h
- Total amount: 1,065.00 CHF

**Priority:** HIGH

---

### 3.6 UI/UX Tests

#### TC-UI-001: Mobile Responsive - Dashboard
**Steps:**
1. Set viewport to 320px (mobile)
2. Navigate to dashboard
3. Verify layout

**Expected Result:**
- Projects stack vertically
- Buttons are tappable
- No horizontal scroll

**Priority:** HIGH

---

#### TC-UI-002: Desktop View
**Steps:**
1. Set viewport to 1920px
2. Navigate through app

**Expected Result:**
- Content centered
- Cards in grid layout
- Proper spacing

**Priority:** MEDIUM

---

### 3.7 Edge Cases

#### TC-EDGE-001: Zero Duration Entry
**Steps:**
1. Start timer
2. Immediately stop

**Expected:**
- Entry created with 0.00 hours
- No errors

**Priority:** LOW

---

#### TC-EDGE-002: Special Characters in Description
**Steps:**
1. Stop timer with description: `Testing "quotes", 'apostrophes', <html>`

**Expected:**
- Description saves correctly
- No XSS vulnerabilities
- Displays correctly

**Priority:** MEDIUM

---

## 4. Success Criteria

### Critical (Must Pass)
- [ ] All TC-TIMER tests pass
- [ ] All TC-AUTH tests pass
- [ ] All TC-DATA tests pass
- [ ] No critical bugs

### High Priority
- [ ] 95% of HIGH priority tests pass
- [ ] Calculations 100% accurate
- [ ] Mobile responsive

### Medium Priority
- [ ] 85% of MEDIUM priority tests pass
- [ ] UI meets expectations
- [ ] Error messages clear

---

## 5. Test Execution

### Daily Workflow

**Day 1:** Environment setup, auth testing
**Day 2:** Timer functionality testing
**Day 3:** Entry management, reports
**Day 4:** UI/UX, edge cases
**Day 5:** Regression, final checks

### Issue Reporting

```
ISSUE ID: UAT-###
Test Case: TC-XXX-###
Title: Brief description
Severity: Critical / High / Medium / Low
Steps to Reproduce:
1.
2.
Expected:
Actual:
Screenshot: [attach]
```

---

## 6. Useful Commands

```bash
# Reset database
php artisan migrate:fresh --seed

# View logs
php artisan pail

# Clear cache
php artisan optimize:clear

# Run tests
php artisan test

# Check routes
php artisan route:list --path=time-tracker
```

---

## 7. Sign-Off

```
UAT SIGN-OFF

Project: Time Tracker (Laravel)
UAT Period: [Date] - [Date]

Test Results:
- Total: XX
- Passed: XX
- Failed: XX

Decision: APPROVED / REJECTED

Approved By: _______________ Date: ______
```
