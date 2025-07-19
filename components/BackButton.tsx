"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // Or any other icon library
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui

export const BackButton = ({ title }: { title: string }) => {
  // Get the router instance
  const router = useRouter();

  // Handle the click event
  const handleClick = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        className="flex items-center justify-center"
        variant="outline"
        size="sm"
        onClick={handleClick}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {title && <h2 className="text-md font-semibold">{title}</h2>}
    </div>
  );
};
