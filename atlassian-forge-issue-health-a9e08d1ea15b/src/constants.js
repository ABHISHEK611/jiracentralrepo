export const DEFAULT_NOTIFY_BODY =
    "This issue needs your attention. Check with your team for any blockers.";

export const STORAGE_KEY_PREFIX = 'ISSUE_HEALTH_MONITOR_CONFIG';

export const DATE_TIME_OPTIONS = {
    "default": "yyyy-MM-dd",
    "day": "dd-MM-yyyy",
    "month": "MMMM dd, yyyy",
    "year": "yyyy, dd MMMM",
};

export const DEFAULT_CONFIGURATION = {
    timeConfig: DATE_TIME_OPTIONS.default,
    isAssigneeVisible: true,
    isNotifyAssigneeButtonVisible: true,
    isHistoricalAssigneeVisible: false,
};

export const REQUIRED_ISSUE_FIELDS = ['statuscategorychangedate', 'customfield_10020', 'comment', 'issuelinks', 'assignee']; 
