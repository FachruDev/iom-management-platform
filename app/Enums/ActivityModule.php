<?php

namespace App\Enums;

enum ActivityModule: string
{
    case Authentication = 'Authentication';
    case Dashboard = 'Dashboard';
    case Document = 'Document';
    case Department = 'Department';
    case UserMapping = 'User Mapping';
    case ActivityLog = 'Activity Log';
}
