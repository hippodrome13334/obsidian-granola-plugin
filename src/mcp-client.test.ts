import { describe, it, expect } from "vitest";
import { buildListMeetingsArgs } from "./mcp-client";

describe("buildListMeetingsArgs", () => {
	it("passes through the standard time ranges unchanged", () => {
		expect(buildListMeetingsArgs("this_week")).toEqual({ time_range: "this_week" });
		expect(buildListMeetingsArgs("last_week")).toEqual({ time_range: "last_week" });
		expect(buildListMeetingsArgs("last_30_days")).toEqual({ time_range: "last_30_days" });
	});

	it("translates last_5_years into the server's custom range", () => {
		// The Granola MCP server has no "last_5_years" enum value — only
		// this_week/last_week/last_30_days/custom are valid — so this must
		// be sent as a custom range with explicit start/end dates.
		const args = buildListMeetingsArgs("last_5_years");
		expect(args.time_range).toBe("custom");
		expect(args.custom_start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(args.custom_end).toMatch(/^\d{4}-\d{2}-\d{2}$/);

		const start = new Date(args.custom_start as string);
		const end = new Date(args.custom_end as string);
		const yearsApart = end.getFullYear() - start.getFullYear();
		expect(yearsApart).toBe(5);
	});
});
