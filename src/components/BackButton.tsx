"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="rounded-full cursor-pointer"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-5 md:size-6" />
    </Button>
  );
}

export default BackButton;
