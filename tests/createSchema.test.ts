import { describe, it, expect, vi, afterEach } from "vitest";
import type { Mock } from "vitest";
import fs from "fs/promises";
import path from "path";
import { buildSchema } from "../src/core/createSchema/index.js";
import {
  promptInput,
  promptList,
  promptConfirm,
  promptCheckbox,
} from "../src/core/createSchema/cliNative.js";

// Mock the interactive input module
vi.mock("../src/core/createSchema/cliNative.js", () => {
  return {
    promptInput: vi.fn(),
    promptList: vi.fn(),
    promptConfirm: vi.fn(),
    promptCheckbox: vi.fn(),
  };
});

describe("CLI - createSchema (Integration Mock)", () => {
  const testDir = path.join(process.cwd(), "test-output");

  afterEach(async () => {
    // Restore mocks
    vi.restoreAllMocks();
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true }).catch(() => {});
  });

  it("should generate a valid schema file by simulating user responses", async () => {
    // Cast imported functions as Vitest Mocks to fix TypeScript intellisense errors
    const mockedPromptInput = promptInput as Mock;
    const mockedPromptList = promptList as Mock;
    const mockedPromptConfirm = promptConfirm as Mock;

    // Simulate user responses step-by-step
    
    // 1. Where do you want to save the file?
    // 2. File name (without extension)
    // 3. Field name
    // 4. Enter default value
    mockedPromptInput
      .mockResolvedValueOnce("test-output")
      .mockResolvedValueOnce("MockSchema")
      .mockResolvedValueOnce("age")
      .mockResolvedValueOnce("18");

    // 1. Select the output format
    // 2. Select type of field "age"
    mockedPromptList
      .mockResolvedValueOnce("esm") 
      .mockResolvedValueOnce("int"); 

    // 1. Do you want to set a default value?
    // 2. Add another field to the schema?
    mockedPromptConfirm
      .mockResolvedValueOnce(true) // Yes, I want a default
      .mockResolvedValueOnce(false); // No, I don't want more fields

    // (promptCheckbox is not called in this flow because we didn't select 'string')

    // Execute the main function
    await buildSchema();

    // Verify if the file was created
    const filePath = path.join(testDir, "mockschema.mjs");
    const content = await fs.readFile(filePath, "utf-8");

    // Verify the generated content
    expect(content).toContain("export default {");
    expect(content).toContain('age: {');
    expect(content).toContain('type: "int"');
    expect(content).toContain("default: 18");
  });

  it("should validate context prompts when generating nested arrays and objects", async () => {
    const mockedPromptInput = promptInput as Mock;
    const mockedPromptList = promptList as Mock;
    const mockedPromptConfirm = promptConfirm as Mock;
    const mockedPromptCheckbox = promptCheckbox as Mock;

    mockedPromptInput
      .mockResolvedValueOnce("test-output")
      .mockResolvedValueOnce("NestedSchema")
      .mockResolvedValueOnce("users")
      .mockResolvedValueOnce("name")
      .mockResolvedValueOnce("metadata")
      .mockResolvedValueOnce("count");

    mockedPromptList
      .mockResolvedValueOnce("esm")
      .mockResolvedValueOnce("array")
      .mockResolvedValueOnce("object")
      .mockResolvedValueOnce("string")
      .mockResolvedValueOnce("object")
      .mockResolvedValueOnce("int");

    mockedPromptConfirm
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false);

    mockedPromptCheckbox.mockResolvedValueOnce([]);

    await buildSchema();

    expect(mockedPromptInput).toHaveBeenCalledWith("Field name (for items of array \"users\"):");
    expect(mockedPromptInput).toHaveBeenCalledWith("Field name (for object \"metadata\"):");

    const filePath = path.join(testDir, "nestedschema.mjs");
    const content = await fs.readFile(filePath, "utf-8");

    expect(content).toContain("users: [");
    expect(content).toContain("name: {");
    expect(content).toContain('type: "string"');
    expect(content).toContain("metadata: {");
    expect(content).toContain("count: {");
    expect(content).toContain('type: "int"');
  });
});
