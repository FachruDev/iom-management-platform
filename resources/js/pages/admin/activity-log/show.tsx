import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type {ActivityLog} from '@/types';
import { resourceItem  } from '@/utils/resource';
import type {ResourceItem} from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function ActivityLogShow({ activity }: { activity: ResourceItem<ActivityLog> }) {
    const item = resourceItem(activity);

    return (
        <AppLayout title="Detail Activity Log">
            <Head title="Detail Activity Log" />
            <Link href={withUserQuery(admin.activityLog.index.url())} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <h2 className="mb-4 text-base font-semibold">Informasi Aktivitas</h2>
                    <dl className="grid gap-3 text-sm">
                        <div><dt className="text-slate-500">User</dt><dd className="font-medium">{item.user_name || '-'} ({item.user_id || '-'})</dd></div>
                        <div><dt className="text-slate-500">Department</dt><dd className="font-medium">{item.department || '-'}</dd></div>
                        <div><dt className="text-slate-500">Modul</dt><dd className="font-medium">{item.module}</dd></div>
                        <div><dt className="text-slate-500">Aktivitas</dt><dd className="font-medium">{item.activity}</dd></div>
                        <div><dt className="text-slate-500">Model</dt><dd className="font-medium">{item.model || '-'}</dd></div>
                        <div><dt className="text-slate-500">Record ID</dt><dd className="font-medium">{item.record_id || '-'}</dd></div>
                        <div><dt className="text-slate-500">IP / User Agent</dt><dd className="font-medium">{item.ip_address || '-'} / {item.user_agent || '-'}</dd></div>
                    </dl>
                </Card>
                <Card>
                    <h2 className="mb-4 text-base font-semibold">Detail Perubahan</h2>
                    <div className="grid gap-4">
                        <pre className="max-h-80 overflow-auto rounded-md bg-slate-950 p-4 text-xs text-white">{JSON.stringify({ old_values: item.old_values, new_values: item.new_values }, null, 2)}</pre>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
