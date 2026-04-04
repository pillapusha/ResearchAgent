import { useState } from 'react';
import { History, Trash2, Clock, ChevronRight, Search } from 'lucide-react';
import type { ResearchEntry } from '@/hooks/useResearchHistory';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { formatDistanceToNow } from 'date-fns';

interface HistorySidebarProps {
  history: ResearchEntry[];
  onSelect: (entry: ResearchEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export default function HistorySidebar({ history, onSelect, onDelete, onClear }: HistorySidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? history.filter((e) => e.topic.toLowerCase().includes(filter.toLowerCase()))
    : history;

  return (
    <Sidebar collapsible="icon" side="left" className="border-r border-border bg-card">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            <History className="w-4 h-4 mr-2 inline-block" />
            {!collapsed && 'Research History'}
          </SidebarGroupLabel>
          {!collapsed && history.length > 0 && (
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search topics…"
                  className="w-full h-8 pl-7 pr-2 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {filtered.length === 0 && !collapsed && (
                <p className="px-3 py-6 text-xs text-muted-foreground text-center">
                  {filter ? 'No matching topics.' : 'No past research yet.'}
                </p>
              )}
              {filtered.map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton
                    onClick={() => onSelect(entry)}
                    className="group relative"
                    tooltip={collapsed ? entry.topic : undefined}
                  >
                    <ChevronRight className="w-4 h-4 shrink-0 text-primary" />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <span className="block truncate text-sm text-foreground font-medium">
                          {entry.topic}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(entry.completedAt), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    {!collapsed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && history.length > 0 && (
        <SidebarFooter>
          <button
            onClick={onClear}
            className="w-full text-xs text-muted-foreground hover:text-destructive font-mono py-2 transition-colors"
          >
            Clear all history
          </button>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
