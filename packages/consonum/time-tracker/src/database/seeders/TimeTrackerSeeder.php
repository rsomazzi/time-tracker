<?php

namespace Consonum\TimeTracker\Database\Seeders;

use Illuminate\Database\Seeder;
use Consonum\TimeTracker\Models\Company;
use Consonum\TimeTracker\Models\Customer;
use Consonum\TimeTracker\Models\Project;
use Consonum\TimeTracker\Models\Category;

class TimeTrackerSeeder extends Seeder
{
    public function run(): void
    {
        // Create a company
        $company = Company::create([
            'name' => 'Consonum GmbH',
            'address' => 'Musterstrasse 1',
            'city' => 'Zürich',
            'postal_code' => '8000',
            'country' => 'CH',
            'email' => 'info@consonum.ch',
        ]);

        // Create customers
        $customer1 = Customer::create([
            'company_id' => $company->id,
            'name' => 'ABC AG',
            'contact_person' => 'Max Mustermann',
            'email' => 'max@abc.ch',
        ]);

        $customer2 = Customer::create([
            'company_id' => $company->id,
            'name' => 'XYZ GmbH',
            'contact_person' => 'Anna Schmidt',
            'email' => 'anna@xyz.ch',
        ]);

        // Create projects with categories
        $project1 = Project::create([
            'customer_id' => $customer1->id,
            'name' => 'Website Redesign',
            'code' => 'WEB-001',
            'color' => '#3B82F6',
            'department' => 'Development',
            'hourly_rate' => 150.00,
            'status' => 'active',
        ]);

        Category::create([
            'project_id' => $project1->id,
            'code' => 'DEV',
            'name' => 'Development',
            'sort_order' => 1,
        ]);
        Category::create([
            'project_id' => $project1->id,
            'code' => 'DES',
            'name' => 'Design',
            'sort_order' => 2,
        ]);
        Category::create([
            'project_id' => $project1->id,
            'code' => 'PM',
            'name' => 'Project Management',
            'sort_order' => 3,
        ]);

        $project2 = Project::create([
            'customer_id' => $customer2->id,
            'name' => 'Mobile App',
            'code' => 'APP-001',
            'color' => '#10B981',
            'department' => 'Mobile',
            'hourly_rate' => 175.00,
            'status' => 'active',
        ]);

        Category::create([
            'project_id' => $project2->id,
            'code' => 'IOS',
            'name' => 'iOS Development',
            'sort_order' => 1,
        ]);
        Category::create([
            'project_id' => $project2->id,
            'code' => 'AND',
            'name' => 'Android Development',
            'sort_order' => 2,
        ]);
        Category::create([
            'project_id' => $project2->id,
            'code' => 'QA',
            'name' => 'Quality Assurance',
            'sort_order' => 3,
        ]);

        $project3 = Project::create([
            'customer_id' => $customer1->id,
            'name' => 'API Integration',
            'code' => 'API-001',
            'color' => '#F59E0B',
            'department' => 'Backend',
            'hourly_rate' => 160.00,
            'status' => 'active',
        ]);

        Category::create([
            'project_id' => $project3->id,
            'code' => 'INT',
            'name' => 'Integration',
            'sort_order' => 1,
        ]);
        Category::create([
            'project_id' => $project3->id,
            'code' => 'DOC',
            'name' => 'Documentation',
            'sort_order' => 2,
        ]);
    }
}
