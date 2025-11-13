#!/usr/bin/env node

/**
 * Pre-publish verification script
 * Run this before publishing to npm to ensure everything is ready
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const checks = {
	passed: [],
	failed: [],
	warnings: [],
};

console.log("\n🔍 Running pre-publish checks...\n");

// Check 1: package.json exists and is valid
try {
	const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
	checks.passed.push("✅ package.json is valid");

	// Check version
	if (!packageJson.version) {
		checks.failed.push("❌ Missing version in package.json");
	} else {
		checks.passed.push(`✅ Version: ${packageJson.version}`);
	}

	// Check name
	if (!packageJson.name) {
		checks.failed.push("❌ Missing name in package.json");
	} else {
		checks.passed.push(`✅ Package name: ${packageJson.name}`);
	}

	// Check license
	if (!packageJson.license) {
		checks.warnings.push("⚠️  No license specified");
	} else {
		checks.passed.push(`✅ License: ${packageJson.license}`);
	}

	// Check repository
	if (!packageJson.repository) {
		checks.warnings.push("⚠️  No repository specified");
	} else {
		checks.passed.push("✅ Repository URL present");
	}

	// Check dependencies
	if (packageJson.dependencies) {
		const depCount = Object.keys(packageJson.dependencies).length;
		checks.passed.push(`✅ ${depCount} dependencies declared`);
	}
} catch (error) {
	checks.failed.push("❌ Invalid or missing package.json");
}

// Check 2: README exists
if (fs.existsSync("README.md")) {
	const readme = fs.readFileSync("README.md", "utf8");
	checks.passed.push("✅ README.md exists");

	if (readme.length < 100) {
		checks.warnings.push("⚠️  README.md seems too short");
	} else {
		checks.passed.push(`✅ README.md (${readme.length} chars)`);
	}
} else {
	checks.failed.push("❌ README.md is missing");
}

// Check 3: LICENSE exists
if (fs.existsSync("LICENSE")) {
	checks.passed.push("✅ LICENSE file exists");
} else {
	checks.warnings.push("⚠️  LICENSE file is missing");
}

// Check 4: Required files exist
const requiredFiles = ["bin/generate.js", "bin/delete.js", "example.yaml"];

requiredFiles.forEach((file) => {
	if (fs.existsSync(file)) {
		checks.passed.push(`✅ ${file} exists`);
	} else {
		checks.failed.push(`❌ ${file} is missing`);
	}
});

// Check 5: Framework directories exist
const frameworks = ["vue"];
frameworks.forEach((framework) => {
	const dir = `frameworks/${framework}`;
	if (fs.existsSync(dir)) {
		checks.passed.push(`✅ ${framework} framework exists`);
	} else {
		checks.failed.push(`❌ ${framework} framework directory is missing`);
	}
});

// Check 6: Templates exist
if (fs.existsSync("frameworks/vue/templates")) {
	const templates = fs.readdirSync("frameworks/vue/templates");
	const hbsFiles = templates.filter((f) => f.endsWith(".hbs"));
	checks.passed.push(`✅ ${hbsFiles.length} Handlebars templates found`);

	if (hbsFiles.length < 10) {
		checks.warnings.push("⚠️  Few templates found, expected more");
	}
} else {
	checks.failed.push("❌ Templates directory is missing");
}

// Check 7: .npmignore exists
if (fs.existsSync(".npmignore")) {
	checks.passed.push("✅ .npmignore exists");
} else {
	checks.warnings.push("⚠️  .npmignore is missing (will use .gitignore)");
}

// Check 8: Git status
try {
	const gitStatus = execSync("git status --porcelain").toString();
	if (gitStatus.trim() === "") {
		checks.passed.push("✅ Git working directory is clean");
	} else {
		checks.warnings.push(
			"⚠️  Uncommitted changes in git (consider committing before publishing)"
		);
	}
} catch (error) {
	checks.warnings.push("⚠️  Not a git repository or git not available");
}

// Check 9: npm audit
try {
	console.log("\n🔒 Running npm audit...");
	execSync("npm audit --audit-level=moderate", { stdio: "inherit" });
	checks.passed.push("✅ No security vulnerabilities found");
} catch (error) {
	checks.warnings.push(
		"⚠️  npm audit found vulnerabilities (run 'npm audit' for details)"
	);
}

// Check 10: Test command
try {
	console.log("\n🧪 Running tests...");
	execSync("npm test", { stdio: "inherit" });
	checks.passed.push("✅ Tests passed");
} catch (error) {
	checks.failed.push("❌ Tests failed");
}

// Check 11: Check if logged into npm
try {
	const npmUser = execSync("npm whoami").toString().trim();
	checks.passed.push(`✅ Logged into npm as: ${npmUser}`);
} catch (error) {
	checks.warnings.push("⚠️  Not logged into npm (run 'npm login')");
}

// Check 12: Verify package can be packed
try {
	console.log("\n📦 Creating test package...");
	const packOutput = execSync("npm pack --dry-run").toString();
	checks.passed.push("✅ Package can be created");

	// Parse output to show what will be included
	const lines = packOutput.split("\n");
	const fileCount = lines.filter((l) => l.trim().startsWith("npm notice")).length;
	checks.passed.push(`✅ ${fileCount} files will be included in package`);
} catch (error) {
	checks.failed.push("❌ Failed to create package");
}

// Display results
console.log("\n" + "=".repeat(50));
console.log("📊 RESULTS");
console.log("=".repeat(50) + "\n");

if (checks.passed.length > 0) {
	console.log("✅ PASSED:");
	checks.passed.forEach((msg) => console.log(`  ${msg}`));
	console.log();
}

if (checks.warnings.length > 0) {
	console.log("⚠️  WARNINGS:");
	checks.warnings.forEach((msg) => console.log(`  ${msg}`));
	console.log();
}

if (checks.failed.length > 0) {
	console.log("❌ FAILED:");
	checks.failed.forEach((msg) => console.log(`  ${msg}`));
	console.log();
}

console.log("=".repeat(50) + "\n");

// Final verdict
if (checks.failed.length === 0) {
	console.log("🎉 All checks passed!");
	console.log("\n📝 Next steps:");
	console.log("  1. Review the checks above");
	console.log("  2. Update version: npm version [patch|minor|major]");
	console.log("  3. Push changes: git push && git push --tags");
	console.log("  4. Publish: npm publish --access public");
	console.log("  5. Create GitHub release\n");
	process.exit(0);
} else {
	console.log("❌ Some checks failed. Please fix the issues above before publishing.\n");
	process.exit(1);
}
