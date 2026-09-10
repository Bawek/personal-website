export const ENTRY_TYPES = {
  work: {
    label: 'Work Experience',
    shortLabel: 'Work',
    orgLabel: 'Company',
    titleLabel: 'Job Title',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  education: {
    label: 'Education',
    shortLabel: 'Education',
    orgLabel: 'Institution',
    titleLabel: 'Degree / Program',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  certification: {
    label: 'Certification',
    shortLabel: 'Certification',
    orgLabel: 'Issuing Organization',
    titleLabel: 'Certification Name',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  award: {
    label: 'Award / Honor',
    shortLabel: 'Award',
    orgLabel: 'Organization',
    titleLabel: 'Award Title',
    color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  talk: {
    label: 'Talk / Presentation',
    shortLabel: 'Talk',
    orgLabel: 'Event / Conference',
    titleLabel: 'Talk Title',
    color: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  },
}

export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance']

export function getEntryMeta(entryType) {
  return ENTRY_TYPES[entryType] || ENTRY_TYPES.work
}
