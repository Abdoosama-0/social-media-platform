"use client";

import { Suspense } from "react";
import RecreatePasswordForm from "@/components/RecreatePasswordForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecreatePasswordForm />
    </Suspense>
  );
}