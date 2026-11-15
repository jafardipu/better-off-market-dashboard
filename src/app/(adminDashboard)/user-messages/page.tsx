import { Suspense } from "react";
import MessagesPage from "./_components/MessagesPage";

export default function UserMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
          Loading messages...
        </div>
      }
    >
      <MessagesPage />
    </Suspense>
  );
}
