"use client";

import type { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

interface ToolCallDisplayProps {
  toolInvocation: ToolInvocation;
}

function basename(path: string): string {
  return path.split("/").pop() || path;
}

function getToolCallLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const path: string | undefined = args?.path;

  if (!path) {
    return toolName;
  }

  const filename = basename(path);

  if (toolName === "str_replace_editor") {
    switch (args?.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Updating ${filename}`;
      case "view":
        return `Viewing ${filename}`;
      case "undo_edit":
        return `Reverting ${filename}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    switch (args?.command) {
      case "rename":
        return args?.new_path
          ? `Renaming ${filename} to ${basename(args.new_path)}`
          : `Renaming ${filename}`;
      case "delete":
        return `Deleting ${filename}`;
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolCallDisplay({ toolInvocation }: ToolCallDisplayProps) {
  const isComplete = toolInvocation.state === "result" && "result" in toolInvocation && toolInvocation.result;
  const label = getToolCallLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
