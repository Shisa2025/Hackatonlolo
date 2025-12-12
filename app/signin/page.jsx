"use client";

import { Suspense } from "react";
import SignInClient from "./SignInClient";

export const dynamic = "force-dynamic";

// Whole page runs on the client to avoid CSR bailout issues on Vercel.
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInClient />
    </Suspense>
  );
}
