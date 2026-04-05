#!/usr/bin/env node
/**
 * Validates all manifest.json files in addons/ against the JSON Schema.
 * Run: node scripts/validate.js
 * Exit code 0 = all valid, 1 = validation errors found.
 */

const fs = require("fs");
const path = require("path");

const ADDONS_DIR = path.join(__dirname, "..", "addons");
const SCHEMA_PATH = path.join(__dirname, "..", "schema", "manifest.schema.json");

// Minimal JSON Schema validator (no external deps required in CI)
function validate(manifest, schema) {
  const errors = [];

  // Check required fields
  for (const field of schema.required || []) {
    if (manifest[field] === undefined || manifest[field] === null) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  // Check no extra fields
  if (schema.additionalProperties === false) {
    for (const key of Object.keys(manifest)) {
      if (!schema.properties[key]) {
        errors.push(`Unknown field: "${key}"`);
      }
    }
  }

  // Type + pattern checks
  for (const [field, rule] of Object.entries(schema.properties || {})) {
    const value = manifest[field];
    if (value === undefined) continue;

    if (rule.type === "string" && typeof value !== "string") {
      errors.push(`Field "${field}" must be a string`);
    }
    if (rule.type === "array" && !Array.isArray(value)) {
      errors.push(`Field "${field}" must be an array`);
    }
    if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
      errors.push(`Field "${field}" must be at least ${rule.minLength} characters`);
    }
    if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
      errors.push(`Field "${field}" must be at most ${rule.maxLength} characters`);
    }
    if (rule.pattern && typeof value === "string" && !new RegExp(rule.pattern).test(value)) {
      errors.push(`Field "${field}" does not match pattern: ${rule.pattern}`);
    }
    if (rule.enum && !rule.enum.includes(value)) {
      errors.push(`Field "${field}" must be one of: ${rule.enum.join(", ")}`);
    }
    if (rule.items && Array.isArray(value)) {
      for (const [i, item] of value.entries()) {
        if (rule.items.pattern && !new RegExp(rule.items.pattern).test(item)) {
          errors.push(`Field "${field}[${i}]" does not match pattern: ${rule.items.pattern}`);
        }
        if (rule.items.maxLength && item.length > rule.items.maxLength) {
          errors.push(`Field "${field}[${i}]" exceeds max length ${rule.items.maxLength}`);
        }
        if (rule.items.enum && !rule.items.enum.includes(item)) {
          errors.push(`Field "${field}[${i}]" must be one of: ${rule.items.enum.join(", ")}`);
        }
      }
      if (rule.uniqueItems) {
        const dupes = value.filter((v, i) => value.indexOf(v) !== i);
        if (dupes.length > 0) {
          errors.push(`Field "${field}" has duplicate items: ${dupes.join(", ")}`);
        }
      }
      if (rule.maxItems && value.length > rule.maxItems) {
        errors.push(`Field "${field}" has too many items (max ${rule.maxItems})`);
      }
      if (rule.minItems && value.length < rule.minItems) {
        errors.push(`Field "${field}" needs at least ${rule.minItems} items`);
      }
    }
  }

  // id in manifest must match the directory name
  return errors;
}

function main() {
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  const addonDirs = fs.readdirSync(ADDONS_DIR).filter((d) => {
    return fs.statSync(path.join(ADDONS_DIR, d)).isDirectory();
  });

  let totalErrors = 0;

  for (const dir of addonDirs) {
    const manifestPath = path.join(ADDONS_DIR, dir, "manifest.json");
    process.stdout.write(`  checking ${dir}... `);

    if (!fs.existsSync(manifestPath)) {
      console.log("FAIL");
      console.error(`    ✗ Missing manifest.json in addons/${dir}/`);
      totalErrors++;
      continue;
    }

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (e) {
      console.log("FAIL");
      console.error(`    ✗ Invalid JSON: ${e.message}`);
      totalErrors++;
      continue;
    }

    // id must match directory name
    if (manifest.id !== dir) {
      const errors = [`id "${manifest.id}" must match directory name "${dir}"`];
      console.log("FAIL");
      errors.forEach((e) => console.error(`    ✗ ${e}`));
      totalErrors += errors.length;
      continue;
    }

    const errors = validate(manifest, schema);
    if (errors.length === 0) {
      console.log("OK");
    } else {
      console.log("FAIL");
      errors.forEach((e) => console.error(`    ✗ ${e}`));
      totalErrors += errors.length;
    }
  }

  console.log("");
  if (totalErrors === 0) {
    console.log(`✓ All ${addonDirs.length} manifests valid`);
    process.exit(0);
  } else {
    console.error(`✗ ${totalErrors} error(s) found across ${addonDirs.length} manifests`);
    process.exit(1);
  }
}

main();
