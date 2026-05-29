import { getLaunchReadiness } from "../launch-readiness.js";

const readiness = getLaunchReadiness();

console.log(`Launch readiness score: ${readiness.score}%`);
console.log(`Pass: ${readiness.counts.pass || 0}  Warn: ${readiness.counts.warn || 0}  Block: ${readiness.counts.block || 0}`);

for (const item of readiness.checks) {
  const marker = item.status === "pass" ? "PASS" : item.status === "warn" ? "WARN" : "BLOCK";
  console.log(`${marker} ${item.label} - ${item.detail}`);
  if (item.status !== "pass" && item.action) console.log(`  Action: ${item.action}`);
}

if (!readiness.launchReady) {
  console.error("\nLaunch is blocked until the BLOCK items are resolved.");
  process.exit(1);
}

console.log("\nLaunch readiness checks passed.");
