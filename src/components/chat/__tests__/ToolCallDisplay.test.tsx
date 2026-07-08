import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("shows 'Creating {file}' for str_replace_editor create command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/App.jsx" },
    state: "result",
    result: "File created",
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Updating {file}' for str_replace_editor str_replace command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "src/components/Card.jsx" },
    state: "result",
    result: "Replaced",
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Updating Card.jsx")).toBeDefined();
});

test("shows 'Updating {file}' for str_replace_editor insert command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "src/Card.jsx" },
    state: "result",
    result: "Inserted",
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Updating Card.jsx")).toBeDefined();
});

test("shows 'Viewing {file}' for str_replace_editor view command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "src/Card.jsx" },
    state: "result",
    result: "file contents",
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing Card.jsx")).toBeDefined();
});

test("shows 'Reverting {file}' for str_replace_editor undo_edit command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "str_replace_editor",
    args: { command: "undo_edit", path: "src/Card.jsx" },
    state: "result",
    result: "Error: undo_edit command is not supported in this version.",
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Reverting Card.jsx")).toBeDefined();
});

test("shows 'Renaming {file} to {newFile}' for file_manager rename command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    args: {
      command: "rename",
      path: "src/Old.jsx",
      new_path: "src/New.jsx",
    },
    state: "result",
    result: { success: true, message: "Successfully renamed" },
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Renaming Old.jsx to New.jsx")).toBeDefined();
});

test("shows 'Deleting {file}' for file_manager delete command", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "file_manager",
    args: { command: "delete", path: "src/Old.jsx" },
    state: "result",
    result: { success: true, message: "Successfully deleted" },
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting Old.jsx")).toBeDefined();
});

test("falls back to raw tool name when args are missing", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "8",
    toolName: "str_replace_editor",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("falls back to raw tool name for an unrecognized tool", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "9",
    toolName: "some_other_tool",
    args: { path: "src/Card.jsx" },
    state: "result",
    result: "done",
  } as unknown as ToolInvocation;

  render(<ToolCallDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("shows completed indicator when state is result with a result value", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "10",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/App.jsx" },
    state: "result",
    result: "Success",
  };

  const { container } = render(
    <ToolCallDisplay toolInvocation={toolInvocation} />
  );

  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows loading spinner when state is not result", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "11",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/App.jsx" },
    state: "call",
  } as ToolInvocation;

  const { container } = render(
    <ToolCallDisplay toolInvocation={toolInvocation} />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
