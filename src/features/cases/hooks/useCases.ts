import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../../api/api';
import { caseReviewToViewModel } from '../../../api/adapters';
import type { CaseListQuery } from '../../../api/api';
import type { CaseCounts, CaseReview, CaseViewModel, CasesTab } from '../../../types';

const PAGE_SIZE = 20;

/** Per-tab paginated state */
interface TabState {
  items: CaseViewModel[];
  count: number;
  page: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const INITIAL_TAB_STATE: TabState = {
  items: [],
  count: 0,
  page: 1,
  hasMore: true,
  loading: true,
  loadingMore: false,
  error: null,
};

type AllTabState = Record<CasesTab, TabState>;

const ALL_TABS: CasesTab[] = ['live', 'claimed', 'completed', 'missed', 'escalated'];

const INITIAL_COUNTS: CaseCounts = { live: 0, claimed: 0, completed: 0, missed: 0, escalated: 0 };

const DEBOUNCE_MS = 300;

const fetchPage = async (
  status: CasesTab,
  page: number,
  search: string,
): Promise<{ results: CaseReview[]; count: number }> => {
  const query: CaseListQuery = { status, page, page_size: PAGE_SIZE };
  if (search.trim()) query.search = search.trim();
  const res = await api.cases.list(query);
  return { results: res.results ?? [], count: res.count ?? 0 };
};

export const useCases = () => {
  const [activeTab, setActiveTabRaw] = useState<CasesTab>('live');
  const [search, setSearch] = useState('');

  // Single state object for all tabs — avoids 5 separate useState calls
  const [tabState, setTabState] = useState<AllTabState>(() =>
    Object.fromEntries(ALL_TABS.map((t) => [t, { ...INITIAL_TAB_STATE }])) as AllTabState,
  );

  // Track which tabs have been loaded at least once — prevents re-fetching on tab switch
  const loadedTabs = useRef<Set<CasesTab>>(new Set());
// Track in-flight fetches per tab to prevent duplicate calls
  const fetchingRef = useRef<Set<CasesTab>>(new Set());

  // Separate counts state — decoupled from tab items to prevent re-render cascade
  const [counts, setCounts] = useState<CaseCounts>(INITIAL_COUNTS);

  // Debounce timer ref for search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateTab = useCallback((tab: CasesTab, patch: Partial<TabState>) => {
    setTabState((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], ...patch },
    }));
  }, []);

  /** Load page 1 of a tab. Skips if already loaded (unless forced). */
  const loadTab = useCallback(async (tab: CasesTab, q: string, force = false) => {
    if (fetchingRef.current.has(tab)) return;
    if (!force && loadedTabs.current.has(tab) && q === '') return;

    fetchingRef.current.add(tab);
    updateTab(tab, { loading: true, error: null, items: [], page: 1, hasMore: true });

    try {
      const { results, count } = await fetchPage(tab, 1, q);
      const items = results.map(caseReviewToViewModel);
      loadedTabs.current.add(tab);
      updateTab(tab, {
        items,
        count,
        page: 1,
        hasMore: items.length < count,
        loading: false,
      });
    } catch (e) {
      updateTab(tab, { loading: false, error: e instanceof Error ? e.message : 'Error' });
    } finally {
      fetchingRef.current.delete(tab);
    }
  }, [updateTab]);

  /** Load the next page for the active tab (called on scroll-end). */
  const loadMore = useCallback(async () => {
    const s = tabState[activeTab];
    if (s.loadingMore || s.loading || !s.hasMore || fetchingRef.current.has(activeTab)) return;

    fetchingRef.current.add(activeTab);
    const nextPage = s.page + 1;
    updateTab(activeTab, { loadingMore: true });

    try {
      const { results, count } = await fetchPage(activeTab, nextPage, search);
      const newItems = results.map(caseReviewToViewModel);
      const existingIds = new Set(s.items.map((i) => i.id));
      const uniqueNew = newItems.filter((i) => !existingIds.has(i.id));
      updateTab(activeTab, {
        items: [...s.items, ...uniqueNew],
        page: nextPage,
        count,
        hasMore: s.items.length + uniqueNew.length < count,
        loadingMore: false,
      });
    } catch (e) {
      updateTab(activeTab, { loadingMore: false });
    } finally {
      fetchingRef.current.delete(activeTab);
    }
  }, [activeTab, tabState, search, updateTab]);

  // Load active tab on mount or when it hasn't been loaded yet
  const setActiveTab = useCallback((tab: CasesTab) => {
    setActiveTabRaw(tab);
    if (!loadedTabs.current.has(tab)) {
      loadTab(tab, '');
    }
  }, [loadTab]);

  // Initial load: fetch counts + live tab on mount
  const initialLoadDone = useRef(false);
  if (!initialLoadDone.current) {
    initialLoadDone.current = true;
    loadTab('live', '');
    api.cases.counts().then(setCounts).catch(() => {});
  }

  /** Called when search text changes — debounced to avoid per-keystroke API calls */
  const onSearch = useCallback((q: string) => {
    setSearch(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      loadedTabs.current.delete(activeTab);
      loadTab(activeTab, q, true);
    }, DEBOUNCE_MS);
  }, [activeTab, loadTab]);

  /** Pull-to-refresh — reloads active tab from page 1 + refreshes counts */
  const refetch = useCallback(async () => {
    loadedTabs.current.delete(activeTab);
    await loadTab(activeTab, search, true);
    api.cases.counts().then(setCounts).catch(() => {});
  }, [activeTab, search, loadTab]);

  const active = tabState[activeTab];

  return {
    activeTab,
    setActiveTab,
    data: active.items,
    counts,
    loading: active.loading,
    loadingMore: active.loadingMore,
    hasMore: active.hasMore,
    error: active.error,
    search,
    onSearch,
    loadMore,
    refetch,
    findById: (id: string): CaseViewModel | undefined =>
      Object.values(tabState)
        .flatMap((s) => s.items)
        .find((c) => c.id === id || c.caseId === id),
  };
};