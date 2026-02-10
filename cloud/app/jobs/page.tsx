'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faPlus, faTrash, faEye, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import AuthedLayout from '@/components/layouts/AuthedLayout';
import type { Job, JobStatus } from '@/lib/api-client';

const statusColors: Record<JobStatus, string> = {
  creating: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Running: 'bg-green-500/20 text-green-400 border-green-500/30',
  Succeeded: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  Unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function JobsPage() {
  const { user } = useAuth();
  const { jobs, loading, error, deleteJob } = useJobs();

  const handleDelete = async (jobId: string) => {
    if (!confirm('Delete this job?')) return;
    try { await deleteJob(jobId); } catch { alert('Failed to delete'); }
  };

  const getStatusStyle = (status: JobStatus) => {
    return statusColors[status] || statusColors.Unknown;
  };

  return (
    <AuthedLayout>
      <main className="px-8 py-8">
          <div className="max-w-[1200px] mx-auto">
            {/* Title */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-medium mb-1">GPU Jobs</h1>
                <p className="text-sm text-gray-500">Manage your GPU container jobs</p>
              </div>
              <Link href="/jobs/create"
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 rounded flex items-center gap-2 text-sm font-medium">
                <FontAwesomeIcon icon={faPlus} /> New Job
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm p-4 bg-red-500/10 border border-red-500/30 rounded mb-6">{error}</div>
            )}

            {/* Loading */}
            {loading && jobs.length === 0 && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-red-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Loading jobs...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <div className="text-center py-20 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md">
                <div className="w-16 h-16 mx-auto bg-[#111] rounded-md flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faServer} className="text-2xl text-gray-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No jobs yet</h3>
                <p className="text-sm text-gray-500 mb-6">Create your first GPU job to get started</p>
                <Link href="/jobs/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded text-sm font-medium">
                  <FontAwesomeIcon icon={faPlus} /> Create Job
                </Link>
              </div>
            )}

            {/* Jobs Grid */}
            {jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job: Job) => (
                  <div key={job.job_id}
                    className="bg-[#111] border border-[#333] rounded-md p-5 hover:border-red-500/50 transition-all">

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded flex items-center justify-center">
                          <FontAwesomeIcon icon={faServer} className="text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{job.job_id}</h3>
                          <p className="text-xs text-gray-400">
                            {job.gpu_count || 1}x {job.gpu_model || 'GPU'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-3 py-1 rounded border ${getStatusStyle(job.status)}`}>
                          {job.status === 'Running' && (
                            <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse mr-1.5" />
                          )}
                          {job.status === 'Failed' && job.failure_reason === 'OOMKilled' && (
                            <span className="mr-1.5">💥</span>
                          )}
                          {job.status}
                        </span>
                        {job.failure_reason && (
                          <span className="text-xs text-red-400">{job.failure_reason}</span>
                        )}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-t border-b border-[#222] text-sm">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">CPU</div>
                        <div className="text-white">
                          {job.cpu_cores ? `${job.cpu_cores} ${parseInt(job.cpu_cores) > 1 ? 'cores' : 'core'}` : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Memory</div>
                        <div className="text-white">
                          {job.memory_gb ? job.memory_gb.replace('Gi', ' GB').replace('Mi', ' MB') : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Storage</div>
                        <div className="text-white">
                          {job.storage_gb ? job.storage_gb.replace('Gi', ' GB').replace('Mi', ' MB') : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Price</div>
                        <div className="text-red-400 font-medium">${job.price_per_hour?.toFixed(2) || '0.00'}/hr</div>
                      </div>
                    </div>

                    {/* SSH Info for Running Jobs */}
                    {job.status === 'Running' && job.ssh_host && (
                      <div className="mb-4 p-3 bg-[#0a0a0a] border border-[#222] rounded">
                        <div className="text-xs text-gray-500 mb-2">SSH Connection</div>
                        <code className="text-sm text-green-400 font-mono">
                          ssh root@{job.ssh_host} -p {job.ssh_port}
                        </code>
                      </div>
                    )}

                    {/* Suggestion for Failed Jobs */}
                    {job.suggestion && (
                      <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                        <div className="text-xs text-yellow-400 font-medium mb-1">💡 권장 조치</div>
                        <div className="text-sm text-yellow-300">{job.suggestion.message}</div>
                        {job.suggestion.recommended_memory && (
                          <div className="mt-1 text-sm text-green-400 font-mono">
                            메모리: {job.suggestion.recommended_memory}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/jobs/${job.job_id}/monitor`}
                        className="px-3 py-1.5 bg-[#111] hover:bg-[#1a1a1a] text-white border border-[#222] hover:border-red-500/50 rounded text-xs font-medium flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faTerminal} className="text-[10px]" /> Logs
                      </Link>
                      <button onClick={() => handleDelete(job.job_id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-medium flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faTrash} className="text-[10px]" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
    </AuthedLayout>
  );
}
