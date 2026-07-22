"use client";

export function PreviewBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900">
      <span>⚠ Preview mode — you are viewing unpublished draft content</span>
      <a
        href="/api/draft/disable"
        className="rounded bg-yellow-900 px-3 py-1 text-xs text-yellow-100 hover:bg-yellow-800 transition-colors"
      >
        Exit preview
      </a>
    </div>
  );
}
