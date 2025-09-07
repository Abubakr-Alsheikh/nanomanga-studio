"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditableTruncatedTextProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  truncateLength?: number;
}

export function EditableTruncatedText({
  label,
  value,
  onChange,
  truncateLength = 150,
}: EditableTruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncated = value.length > truncateLength;

  return (
    <div>
      <h4 className="font-semibold mb-2">{label}</h4>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`text-muted-foreground transition-all duration-300 ${
          isTruncated && !isExpanded ? `h-20` : `h-40`
        }`}
      />
      {isTruncated && (
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 h-auto mt-1"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
}
