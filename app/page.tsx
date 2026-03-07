import { Suspense } from "react";
import GiftQuest from "@/app/components/GiftQuest";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted">
          Загрузка...
        </div>
      }
    >
      <GiftQuest />
    </Suspense>
  );
}
