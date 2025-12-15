"use client";
import React, { Suspense } from "react";
import { CreateFlow } from "@/components/create/CreateFlow";

export default function UploadPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Studio...</div>}>
            <CreateFlow />
        </Suspense>
    )
}
