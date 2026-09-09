import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.API_BASE || 'http://localhost:3000').replace(/\/$/, '')
const api = axios.create({ baseURL: API_BASE })

const EMPTY_STATS = {
  totalLeads: 0,
  status: {
    verified: 0,
    pending: 0,
    duplicate: 0,
    fake: 0,
    matched: 0,
  },
  quality: {
    hot: 0,
    warm: 0,
    cold: 0,
  },
}

const LEAD_TABS = [
  { id: 'all', label: 'All Leads', endpoint: '/admin/leads' },
  { id: 'pending', label: 'Pending', endpoint: '/admin/leads/pending' },
  { id: 'verified', label: 'Verified', endpoint: '/admin/leads/verified' },
  { id: 'fake', label: 'Fake', endpoint: '/admin/leads/fake' },
  { id: 'duplicate', label: 'Duplicate', endpoint: '/admin/leads/duplicate' },
  { id: 'matched', label: 'Matched', endpoint: '/admin/leads/matched' },
]

function Icon({ name, size = 20, className = '' }) {
  const paths = {
    users: <><circle cx="8" cy="8" r="2.8" /><circle cx="16.5" cy="7.5" r="2.3" /><path d="M3.8 19.5c.7-3.1 2.3-4.8 4.9-4.8s4.2 1.7 4.9 4.8M14.2 15.2c2.6-.2 4.5 1.2 5.2 4.1" /></>,
    verified: <><path d="M12 3.2 14.3 5l3-.1.8 2.8 2.4 1.8-1.1 2.7.6 2.9-2.7 1.2-1.6 2.4-2.8-.8-2.8.8-1.6-2.4-2.7-1.2.6-2.9-1.1-2.7 2.4-1.8.8-2.8 3 .1L12 3.2Z" /><path d="m8.5 11.6 2.1 2.1 4.9-5" /></>,
    pending: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.7" /></>,
    shieldX: <><path d="M12 3.2 19 6v5.1c0 4.4-2.8 7.7-7 9.7-4.2-2-7-5.3-7-9.7V6l7-2.8Z" /><path d="m9 9 6 6m0-6-6 6" /></>,
    copy: <><rect x="8.5" y="4" width="10.5" height="13.5" rx="1.5" /><path d="M5 7.5H4a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 4 20.5h8.5" /></>,
    temperature: <><path d="M14.5 14.6V5.5a2.5 2.5 0 0 0-5 0v9.1a4.4 4.4 0 1 0 5 0Z" /><path d="M12 6.5v8.2M12 17.5h.01" strokeWidth="2.2" /><path d="M17.5 7.5h2M17.5 11h2M17.5 14.5h2" /></>,
    sync: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M6.4 9a7 7 0 0 1 11.8-2L20 8.8M4 15.2 5.8 17A7 7 0 0 0 17.6 15" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.2" /><path d="m16 16 4 4" /></>,
    chevronDown: <path d="m7 10 5 5 5-5" />,
    chevronUp: <path d="m7 14 5-5 5 5" />,
    truck: <><path d="M3 5.5h11v10H3zM14 9h3.5l3.5 3.5v3H14z" /><circle cx="7" cy="17.5" r="2" /><circle cx="17" cy="17.5" r="2" /></>,
    calendar: <><rect x="3.5" y="5.5" width="17" height="15" rx="1.5" /><path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" /></>,
    star: <path d="m12 3 2.78 5.63L21 9.54l-4.5 4.39 1.06 6.2L12 17.24l-5.56 2.89 1.06-6.2L3 9.54l6.22-.91L12 3Z" />,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    alert: <><path d="M12 3.5 21 20.2H3L12 3.5Z" /><path d="M12 9v4.4M12 16.8h.01" strokeWidth="2.3" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
    profile: <><circle cx="12" cy="8" r="3" /><path d="M5.5 20c.7-3.4 2.9-5.1 6.5-5.1s5.8 1.7 6.5 5.1" /></>,
    spinner: <path d="M12 3a9 9 0 1 0 9 9" />,
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.alert}
    </svg>
  )
}

function BrandMark() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary shadow-panel">
      <div className="grid h-6 w-6 place-items-center rounded-lg border border-blue-100 bg-blue-50">
        <Icon name="truck" size={15} />
      </div>
    </div>
  )
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback
}

function formatDate(value) {
  if (!value) return 'Not scheduled'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function normaliseLead(lead) {
  return {
    id: String(lead?.leadId || lead?._id || lead?.id || ''),
    customerName: lead?.customerName || [lead?.firstName, lead?.lastName].filter(Boolean).join(' ') || 'Unnamed customer',
    pickupCity: lead?.pickupCity || lead?.pickUp || '—',
    destination: lead?.destination || lead?.dropOff || '—',
    serviceType: lead?.serviceType || lead?.propertyType || '—',
    date: lead?.date || lead?.movingDate,
    quality: lead?.leadQuality || lead?.lead_quality || lead?.quality || 'Unknown',
    currentStatus: lead?.currentStatus || lead?.status || 'Pending',
  }
}

function normaliseStats(data) {
  return {
    totalLeads: Number(data?.totalLeads || 0),
    status: { ...EMPTY_STATS.status, ...(data?.status || {}) },
    quality: { ...EMPTY_STATS.quality, ...(data?.quality || {}) },
  }
}

function statusTone(status) {
  const value = String(status || '').toLowerCase()
  if (value === 'verified') return 'bg-emerald-50 text-emerald-700 ring-emerald-600/15'
  if (value === 'pending') return 'bg-amber-50 text-amber-800 ring-amber-600/15'
  if (value === 'fake') return 'bg-red-50 text-red-700 ring-red-600/15'
  if (value === 'duplicate') return 'bg-slate-100 text-slate-600 ring-slate-500/15'
  if (value === 'matched') return 'bg-blue-50 text-blue-700 ring-blue-600/15'
  return 'bg-violet-50 text-violet-700 ring-violet-600/15'
}

function qualityTone(quality) {
  const value = String(quality || '').toLowerCase()
  if (value === 'hot') return 'bg-red-50 text-red-700 ring-red-600/15'
  if (value === 'warm') return 'bg-amber-50 text-amber-800 ring-amber-600/15'
  if (value === 'cold') return 'bg-sky-50 text-sky-700 ring-sky-600/15'
  return 'bg-slate-100 text-slate-600 ring-slate-500/15'
}

function StatusBadge({ status }) {
  return <span className={'inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ' + statusTone(status)}>{status || 'Pending'}</span>
}

function QualityBadge({ quality }) {
  return <span className={'inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ' + qualityTone(quality)}>{quality || 'Unknown'}</span>
}

function StatCard({ label, value, icon, iconClass, detail, loading }) {
  return (
    <article className="min-h-[142px] rounded-2xl bg-panel p-4 shadow-panel sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted">{label}</span>
        <Icon name={icon} size={22} className={iconClass} />
      </div>
      <div className="mt-6">
        <p className="text-3xl font-bold tracking-tight text-ink">{loading ? '—' : value}</p>
        {detail && <p className="mt-1.5 text-xs font-medium text-muted">{detail}</p>}
      </div>
    </article>
  )
}

function TemperatureCard({ quality, loading }) {
  const temperatures = [
    { label: 'Hot', value: quality.hot, tone: 'text-red-600' },
    { label: 'Warm', value: quality.warm, tone: 'text-amber-600' },
    { label: 'Cold', value: quality.cold, tone: 'text-sky-700' },
  ]

  return (
    <article className="col-span-2 rounded-2xl bg-panel p-4 shadow-panel sm:p-5 lg:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted">Lead Temperature Distribution</span>
        <Icon name="temperature" size={22} className="text-amber-700" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {temperatures.map((temperature) => (
          <div key={temperature.label} className="rounded-xl bg-white px-2 py-3 text-center">
            <p className={'text-[11px] font-bold uppercase tracking-wide ' + temperature.tone}>{temperature.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{loading ? '—' : temperature.value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function Notice({ notice, onDismiss }) {
  if (!notice) return null

  const tone = notice.type === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-emerald-200 bg-emerald-50 text-emerald-800'

  return (
    <div className={'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm ' + tone} role={notice.type === 'error' ? 'alert' : 'status'}>
      <Icon name={notice.type === 'error' ? 'alert' : 'check'} size={19} className="mt-0.5 shrink-0" />
      <p className="flex-1 font-medium">{notice.message}</p>
      <button type="button" onClick={onDismiss} className="rounded-md p-0.5 opacity-70 transition hover:opacity-100" aria-label="Dismiss message">
        <Icon name="close" size={17} />
      </button>
    </div>
  )
}

function CompanyCard({ company, suggested, confirming, onConfirm }) {
  const coverage = Array.isArray(company?.coverageAreas) && company.coverageAreas.length
    ? company.coverageAreas.join(', ')
    : 'Coverage not specified'
  const services = Array.isArray(company?.serviceTypes) && company.serviceTypes.length
    ? company.serviceTypes.join(' · ')
    : 'Services not specified'

  return (
    <article className={'rounded-xl border p-4 ' + (suggested ? 'border-blue-200 bg-blue-50/70' : 'border-slate-200 bg-white')}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-ink">{company?.name || 'Unnamed company'}</h4>
            {suggested && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Suggested</span>}
            {!company?.isActive && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">Inactive</span>}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-700"><Icon name="star" size={14} className="fill-current" /> {company?.rating ?? '—'}</span>
            <span>{services}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted"><span className="font-semibold text-slate-700">Coverage:</span> {coverage}</p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming || !company?.isActive}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          {confirming ? <><Icon name="spinner" size={17} className="animate-spin" /> Matching…</> : <>Match <Icon name="arrow" size={16} /></>}
        </button>
      </div>
    </article>
  )
}

function MatchDropdown({ lead, result, loading, error, confirmingCompanyId, onConfirm }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white p-5 text-sm text-muted shadow-sm">
        <Icon name="spinner" size={20} className="animate-spin text-primary" />
        Finding active companies that cover this route…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <div className="flex items-start gap-2">
          <Icon name="alert" size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const suggestedMatch = result?.suggestedMatch
  const otherMatches = (result?.allMatches || []).filter((company) => String(company?._id) !== String(suggestedMatch?._id))

  if (!suggestedMatch && otherMatches.length === 0) {
    return <p className="rounded-xl bg-white p-5 text-sm text-muted shadow-sm">No active companies currently match this lead’s route and service type.</p>
  }

  return (
    <div className="space-y-4">
      {suggestedMatch && (
        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-ink">Suggested match</h3>
            <span className="text-xs text-muted">Best route and service fit</span>
          </div>
          <CompanyCard
            company={suggestedMatch}
            suggested
            confirming={confirmingCompanyId === String(suggestedMatch._id)}
            onConfirm={() => onConfirm(lead, suggestedMatch)}
          />
        </section>
      )}
      {otherMatches.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-ink">Other matching companies</h3>
          <div className="space-y-2">
            {otherMatches.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
                confirming={confirmingCompanyId === String(company._id)}
                onConfirm={() => onConfirm(lead, company)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function LeadTable({
  leads,
  loading,
  error,
  search,
  onSearchChange,
  expandedLeadId,
  matchResult,
  matchingLeadId,
  matchError,
  confirmingCompanyId,
  onToggleMatches,
  onConfirmMatch,
}) {
  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return leads

    return leads.filter((lead) => [
      lead.customerName,
      lead.pickupCity,
      lead.destination,
      lead.serviceType,
      lead.currentStatus,
      lead.quality,
    ].some((value) => String(value || '').toLowerCase().includes(query)))
  }, [leads, search])

  return (
    <section aria-label="Leads" className="rounded-2xl bg-panel p-3 shadow-panel sm:p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-ink">Lead queue</h2>
          <p className="mt-0.5 text-xs text-muted">{loading ? 'Loading leads…' : filteredLeads.length + ' lead' + (filteredLeads.length === 1 ? '' : 's') + ' shown'}</p>
        </div>
        <label className="relative block w-full sm:w-80">
          <span className="sr-only">Search leads</span>
          <Icon name="search" size={19} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search customer, route…"
            className="h-10 w-full rounded-lg border border-transparent bg-white pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </label>
      </div>

      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="table-scrollbar overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead className="bg-[#eeedf7] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-4 font-bold">Customer Name</th>
              <th className="px-5 py-4 font-bold">Pickup → Destination</th>
              <th className="px-5 py-4 font-bold">Service Type</th>
              <th className="px-5 py-4 font-bold">Moving Date</th>
              <th className="px-5 py-4 font-bold">Quality Badge</th>
              <th className="px-5 py-4 font-bold">Current Status</th>
              <th className="px-5 py-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading && (
              <tr>
                <td colSpan="7" className="px-5 py-12 text-center text-muted">
                  <span className="inline-flex items-center gap-2"><Icon name="spinner" size={19} className="animate-spin text-primary" /> Loading lead data…</span>
                </td>
              </tr>
            )}
            {!loading && filteredLeads.map((lead) => {
              const isExpanded = expandedLeadId === lead.id
              const isMatched = String(lead.currentStatus).toLowerCase() === 'matched'
              return (
                <Fragment key={lead.id}>
                  <tr className={'transition-colors hover:bg-slate-50 ' + (isExpanded ? 'bg-blue-50/35' : '')}>
                    <td className="px-5 py-4 font-semibold text-ink">{lead.customerName}</td>
                    <td className="px-5 py-4 text-muted">{lead.pickupCity} <span className="mx-1 text-slate-400">→</span> {lead.destination}</td>
                    <td className="px-5 py-4 text-muted">{lead.serviceType}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-muted">{formatDate(lead.date)}</td>
                    <td className="px-5 py-4"><QualityBadge quality={lead.quality} /></td>
                    <td className="px-5 py-4"><StatusBadge status={lead.currentStatus} /></td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleMatches(lead)}
                        disabled={isMatched}
                        title={isMatched ? 'This lead is already matched' : 'Find matching companies'}
                        aria-label={isMatched ? 'Lead already matched' : 'Find matching companies for ' + lead.customerName}
                        className={'inline-flex h-9 w-9 items-center justify-center rounded-lg transition ' + (isMatched ? 'cursor-not-allowed bg-slate-100 text-slate-400' : isExpanded ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100')}
                      >
                        {matchingLeadId === lead.id ? <Icon name="spinner" size={18} className="animate-spin" /> : <Icon name={isExpanded ? 'chevronUp' : 'truck'} size={19} />}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-blue-50/45">
                      <td colSpan="7" className="px-5 py-5">
                        <MatchDropdown
                          lead={lead}
                          result={matchResult?.leadId === lead.id ? matchResult : null}
                          loading={matchingLeadId === lead.id}
                          error={matchResult?.leadId === lead.id ? matchError : ''}
                          confirmingCompanyId={confirmingCompanyId}
                          onConfirm={onConfirmMatch}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {!loading && filteredLeads.length === 0 && (
              <tr>
                <td colSpan="7" className="px-5 py-14 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-panel text-muted"><Icon name="users" size={21} /></div>
                    <h3 className="mt-3 font-semibold text-ink">No leads found</h3>
                    <p className="mt-1 text-sm text-muted">{search ? 'Try a different search term.' : 'There are no leads in this category yet.'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function App() {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [statsLoading, setStatsLoading] = useState(true)
  const [leads, setLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [pageError, setPageError] = useState('')
  const [tableError, setTableError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState(null)
  const [expandedLeadId, setExpandedLeadId] = useState(null)
  const [matchingLeadId, setMatchingLeadId] = useState(null)
  const [matchResult, setMatchResult] = useState(null)
  const [matchError, setMatchError] = useState('')
  const [confirmingCompanyId, setConfirmingCompanyId] = useState(null)

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const response = await api.get('/admin/leads/stats')
      if (response.data?.success === false) throw new Error(response.data?.message || 'Unable to load lead statistics.')
      setStats(normaliseStats(response.data?.data))
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadLeads = useCallback(async (tabId) => {
    const tab = LEAD_TABS.find((item) => item.id === tabId) || LEAD_TABS[0]
    setLeadsLoading(true)
    try {
      const response = await api.get(tab.endpoint)
      if (response.data?.success === false) throw new Error(response.data?.message || 'Unable to load leads.')
      const payload = response.data?.data || []
      setLeads(Array.isArray(payload) ? payload.map(normaliseLead) : [])
    } finally {
      setLeadsLoading(false)
    }
  }, [])

  const loadDashboard = useCallback(async (tabId) => {
    const requests = await Promise.allSettled([loadStats(), loadLeads(tabId)])
    const failedRequest = requests.find((request) => request.status === 'rejected')
    if (failedRequest) throw failedRequest.reason
  }, [loadLeads, loadStats])

  useEffect(() => {
    let mounted = true
    const initialise = async () => {
      try {
        await loadDashboard('all')
      } catch (error) {
        if (mounted) setPageError(getErrorMessage(error, 'The dashboard could not be fully loaded. Check that the API is running.'))
      }
    }
    initialise()
    return () => { mounted = false }
  }, [loadDashboard])

  const handleTabChange = async (tabId) => {
    if (tabId === activeTab && !tableError) return
    setActiveTab(tabId)
    setSearch('')
    setTableError('')
    setExpandedLeadId(null)
    setMatchResult(null)
    setMatchError('')
    try {
      await loadLeads(tabId)
    } catch (error) {
      setTableError(getErrorMessage(error, 'Unable to load this lead category.'))
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setPageError('')
    setNotice(null)
    try {
      await loadDashboard(activeTab)
      setNotice({ type: 'success', message: 'Database synchronized. The dashboard statistics and lead list are up to date.' })
    } catch (error) {
      setPageError(getErrorMessage(error, 'Unable to synchronize the dashboard.'))
    } finally {
      setSyncing(false)
    }
  }

  const handleToggleMatches = async (lead) => {
    if (expandedLeadId === lead.id) {
      setExpandedLeadId(null)
      setMatchResult(null)
      setMatchError('')
      return
    }

    setExpandedLeadId(lead.id)
    setMatchingLeadId(lead.id)
    setMatchResult(null)
    setMatchError('')
    try {
      const response = await api.get('/company/match/' + encodeURIComponent(lead.id))
      if (response.data?.success === false) throw new Error(response.data?.message || 'Unable to find matching companies.')
      setMatchResult({
        leadId: lead.id,
        suggestedMatch: response.data?.suggestedMatch,
        allMatches: Array.isArray(response.data?.allMatches) ? response.data.allMatches : [],
      })
    } catch (error) {
      setMatchResult({ leadId: lead.id, suggestedMatch: null, allMatches: [] })
      setMatchError(getErrorMessage(error, 'Unable to find matching companies for this lead.'))
    } finally {
      setMatchingLeadId(null)
    }
  }

  const handleConfirmMatch = async (lead, company) => {
    const companyId = String(company?._id || '')
    if (!lead?.id || !companyId) {
      setMatchError('The selected lead or company is missing an ID.')
      return
    }

    setConfirmingCompanyId(companyId)
    setMatchError('')
    setNotice(null)
    try {
      const response = await api.post('/company/match/' + encodeURIComponent(lead.id) + '/' + encodeURIComponent(companyId))
      if (response.data?.success === false) throw new Error(response.data?.message || 'Unable to match this lead.')

      setLeads((currentLeads) => currentLeads.map((currentLead) => (
        currentLead.id === lead.id ? { ...currentLead, currentStatus: 'Matched' } : currentLead
      )))
      setExpandedLeadId(null)
      setMatchResult(null)
      setNotice({ type: 'success', message: response.data?.message || 'Lead successfully matched with the selected company.' })

      try {
        await loadStats()
      } catch (statsError) {
        setPageError(getErrorMessage(statsError, 'The lead was matched, but dashboard statistics could not be refreshed.'))
      }
    } catch (error) {
      setMatchError(getErrorMessage(error, 'Unable to match this lead with the selected company.'))
    } finally {
      setConfirmingCompanyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-10 text-ink">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-xl font-bold tracking-tight text-ink sm:text-2xl">Admin Dashboard</span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-sm" aria-label="Administrator">
            <Icon name="profile" size={22} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">PackersMart operations</p>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Operations Lead Command</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">Real-time marketplace lead intelligence, automated verification, and carrier matchmaking.</p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-container px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Icon name={syncing ? 'spinner' : 'sync'} size={19} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing database…' : 'Sync Database'}
          </button>
        </div>

        <div className="mt-6">
          <Notice notice={notice} onDismiss={() => setNotice(null)} />
          {pageError && (
            <div className="mt-3">
              <Notice notice={{ type: 'error', message: pageError }} onDismiss={() => setPageError('')} />
            </div>
          )}
        </div>

        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-8">
          <StatCard label="Total Leads" value={stats.totalLeads} icon="users" iconClass="text-primary" detail="All submitted leads" loading={statsLoading} />
          <StatCard label="Verified" value={stats.status.verified} icon="verified" iconClass="text-emerald-600" detail="Ready for matching" loading={statsLoading} />
          <StatCard label="Pending" value={stats.status.pending} icon="pending" iconClass="text-amber-500" detail="Needs review" loading={statsLoading} />
          <StatCard label="Fake / Spam" value={stats.status.fake} icon="shieldX" iconClass="text-red-600" detail="Blocked automatically" loading={statsLoading} />
          <StatCard label="Duplicates" value={stats.status.duplicate} icon="copy" iconClass="text-slate-500" detail="Potential repeats" loading={statsLoading} />
          <StatCard label="Matched" value={stats.status.matched} icon="truck" iconClass="text-blue-600" detail="Assigned to a company" loading={statsLoading} />
          <TemperatureCard quality={stats.quality} loading={statsLoading} />
        </section>

        <section className="mt-8 rounded-2xl bg-panel p-2 shadow-panel sm:p-3">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {LEAD_TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={'shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition ' + (active ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-white hover:text-ink')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </section>

        <div className="mt-4">
          <LeadTable
            leads={leads}
            loading={leadsLoading}
            error={tableError}
            search={search}
            onSearchChange={setSearch}
            expandedLeadId={expandedLeadId}
            matchResult={matchResult}
            matchingLeadId={matchingLeadId}
            matchError={matchError}
            confirmingCompanyId={confirmingCompanyId}
            onToggleMatches={handleToggleMatches}
            onConfirmMatch={handleConfirmMatch}
          />
        </div>
      </main>
    </div>
  )
}

export default App
