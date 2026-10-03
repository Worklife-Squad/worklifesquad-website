// src/lib/projects.ts
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Newest year first, then by title, so the order is stable between builds. */
export async function getSortedProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort(
    (a, b) =>
      b.data.year - a.data.year || a.data.title.localeCompare(b.data.title),
  );
}
