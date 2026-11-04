import { describe, expect, it } from "vitest";
import { visitorKey } from "@/lib/visitor";

const from = (headers: Record<string, string>) => new Headers(headers);

describe("visitorKey", () => {
  it("gives the same key for the same visitor and a different one for another", () => {
    const a = visitorKey(from({ "x-forwarded-for": "198.51.100.1" }), "salt");
    expect(visitorKey(from({ "x-forwarded-for": "198.51.100.1" }), "salt")).toBe(a);
    expect(visitorKey(from({ "x-forwarded-for": "198.51.100.2" }), "salt")).not.toBe(a);
  });

  it("uses the first address when a proxy adds several", () => {
    expect(visitorKey(from({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" }), "s")).toBe(visitorKey(from({ "x-forwarded-for": "198.51.100.1" }), "s"));
  });

  it("changes with the salt, so the same address gives a different key on another deployment", () => {
    expect(visitorKey(from({ "x-forwarded-for": "198.51.100.1" }), "one")).not.toBe(visitorKey(from({ "x-forwarded-for": "198.51.100.1" }), "two"));
  });

  it("never contains the address, and is a fixed short length", () => {
    const key = visitorKey(from({ "x-forwarded-for": "198.51.100.1" }), "salt");
    expect(key).toMatch(/^[0-9a-f]{32}$/);
    expect(key).not.toContain("198.51");
  });
});
