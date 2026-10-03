// scripts/bump-version.js

import fs from 'fs/promises';
import path from 'path';
import { createInterface } from 'readline/promises';
import semver from 'semver';
import chalk from 'chalk';
import ora from 'ora';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Directories walked when adding file-path header comments. Explicit on
// purpose: the version bump touches only the root package.json, but the comment
// pass should reach the whole monorepo.
const TARGET_DIRECTORIES = ['scripts', 'src', 'docs'];

// Names skipped during the recursive walk: dependency and build/dev artifacts,
// plus lock files.
const SKIP_NAMES = new Set([
  'node_modules',
  '.wrangler',
  'dist',
  'package-lock.json',
  'pnpm-lock.json',
  'pnpm-lock.yaml',
  '.astro',
  'assets',
]);

// Extension -> comment delimiters. Plain .json is intentionally excluded: a
// leading `//` line is invalid JSON. .jsonc tolerates it (tsconfig/wrangler),
// and .sql uses a line comment.
//
// `frontmatter: true` marks formats whose code lives inside a `---` fenced
// block (Astro). A comment on line 1 would render as page text there, so the
// header goes on the line below the opening fence instead.
const COMMENT_STYLES = {
  '.js': { start: '//', end: '' },
  '.mjs': { start: '//', end: '' },
  '.ts': { start: '//', end: '' },
  '.jsx': { start: '//', end: '' },
  '.tsx': { start: '//', end: '' },
  '.jsonc': { start: '//', end: '' },
  '.css': { start: '/*', end: '*/' },
  '.sql': { start: '--', end: '' },
  '.astro': { start: '//', end: '', frontmatter: true },
};

const COMMENT_EXTENSIONS = Object.keys(COMMENT_STYLES);

const FRONTMATTER_FENCE = '---';

async function promptForAction() {
  console.log(chalk.cyan('\nAvailable actions:'));
  console.log(chalk.white('1. Update package version'));
  console.log(chalk.white('2. Add file paths as comments'));

  const action = await rl.question(
    chalk.yellow('\nChoose an action (1 or 2): '),
  );
  return action.trim();
}

async function updatePackageVersion(currentVersion) {
  const input = await rl.question(
    chalk.yellow(
      '\nEnter the new version or increment type (p|n|m or patch|minor|major): ',
    ),
  );

  let newVersion;
  const incrementMap = { p: 'patch', n: 'minor', m: 'major' };

  const normalizedInput =
    incrementMap[input.toLowerCase()] || input.toLowerCase();

  if (['patch', 'minor', 'major'].includes(normalizedInput)) {
    newVersion = semver.inc(currentVersion, normalizedInput);
  } else if (semver.valid(input)) {
    if (semver.lt(input, currentVersion)) {
      console.log(
        chalk.yellow(
          `\nWarning: New version (${input}) is lower than the current version (${currentVersion})`,
        ),
      );
    }
    newVersion = input;
  } else {
    console.log(chalk.red('\nInvalid version or increment type'));
    return null;
  }

  return newVersion;
}

// Build the header comment line for a given path and comment style, without a
// trailing space when the style has no closing delimiter.
function buildCommentLine(relativePath, style) {
  return style.end
    ? `${style.start} ${relativePath} ${style.end}`
    : `${style.start} ${relativePath}`;
}

// Header goes on the first line. Replaces an existing header comment when the
// file already starts with one in the same style; otherwise prepends a fresh
// line.
function applyTopHeader(fileContent, commentLine, style) {
  return fileContent.startsWith(style.start)
    ? fileContent.replace(/^.*\n/, `${commentLine}\n`)
    : `${commentLine}\n${fileContent}`;
}

// Header goes directly below the opening `---` fence. Replaces an existing
// header on that line, or inserts a new one. A file with no frontmatter gets a
// minimal block so the comment never leaks into the rendered markup.
function applyFrontmatterHeader(fileContent, commentLine, style) {
  const lines = fileContent.split('\n');

  if (lines[0].trim() !== FRONTMATTER_FENCE) {
    return [
      FRONTMATTER_FENCE,
      commentLine,
      FRONTMATTER_FENCE,
      fileContent,
    ].join('\n');
  }

  const hasHeader = lines[1]?.startsWith(style.start) ?? false;
  lines.splice(1, hasHeader ? 1 : 0, commentLine);
  return lines.join('\n');
}

async function updateFileComment(filePath) {
  try {
    const style = COMMENT_STYLES[path.extname(filePath)];
    if (!style) return;

    const fileContent = await fs.readFile(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    const commentLine = buildCommentLine(relativePath, style);

    const applyHeader = style.frontmatter
      ? applyFrontmatterHeader
      : applyTopHeader;

    await fs.writeFile(filePath, applyHeader(fileContent, commentLine, style));
  } catch (error) {
    console.error(chalk.red(`Error updating file: ${filePath}`), error);
  }
}

async function processDirectory(directory, spinner) {
  spinner.text = `Processing ${directory}...`;

  try {
    await fs.access(directory);
  } catch {
    return;
  }

  const files = await fs.readdir(directory);

  for (const file of files) {
    if (SKIP_NAMES.has(file)) continue;

    const filePath = path.join(directory, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await processDirectory(filePath, spinner);
    } else if (COMMENT_EXTENSIONS.includes(path.extname(filePath))) {
      await updateFileComment(filePath);
    }
  }
}

async function main() {
  try {
    console.log(chalk.cyan('\n=== Version and File Path Update Tool ===\n'));

    const packageJsonPath = 'package.json';
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    const currentVersion = packageJson.version;

    console.log(chalk.white(`Current version: ${chalk.green(currentVersion)}`));

    const action = await promptForAction();

    if (action === '1') {
      const newVersion = await updatePackageVersion(currentVersion);

      if (newVersion) {
        const packageSpinner = ora('Updating package.json...').start();
        try {
          packageJson.version = newVersion;
          await fs.writeFile(
            packageJsonPath,
            JSON.stringify(packageJson, null, 2),
          );
          packageSpinner.succeed(
            chalk.green(`Version successfully updated to ${newVersion}`),
          );
        } catch (error) {
          packageSpinner.fail('Failed to update package.json');
          throw error;
        }
      }
    } else if (action === '2') {
      console.log(chalk.cyan('\nUpdating file comments...'));

      const spinner = ora('Starting...').start();

      try {
        for (const dir of TARGET_DIRECTORIES) {
          await processDirectory(dir, spinner);
        }

        spinner.succeed('File comments updated successfully.');
      } catch (error) {
        spinner.fail('Failed to update file comments.');
        console.error(error);
      }
    } else {
      console.log(
        chalk.red('\nInvalid action selected. Please choose 1 or 2.'),
      );
    }
  } catch (error) {
    console.error(chalk.red('\nAn error occurred:'), error);
  } finally {
    rl.close();
  }
}

main();
