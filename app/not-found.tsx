import React from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-xs tracking-[0.2em] text-nothing-red uppercase mb-4">
        ERROR / 404
      </span>

      <h1 className="font-display text-6xl sm:text-8xl font-bold tracking-tight text-foreground uppercase mb-4">
        SIGNAL LOST
      </h1>

      <p className="font-body text-muted-foreground text-sm sm:text-base max-w-md mb-8">
        The destination you are attempting to reach does not exist or has been relocated to another sector.
      </p>

      <Button href="/" variant="primary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
        Return to Safety
      </Button>
    </div>
  );
}
