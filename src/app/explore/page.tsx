import { Suspense } from "react";
import { ExplorePage } from "@/components/app/explore-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading explore...</div>}>
      <ExplorePage />
    </Suspense>
  );
}
