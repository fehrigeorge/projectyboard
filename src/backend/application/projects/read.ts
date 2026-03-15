/**
 * Read Project Use Cases.
 */

import type { Project } from '@/backend/core/projects/entities'
import type { ProjectRepository } from '@/backend/ports/project-repository'

export type ReadProjectsDeps = {
	projects: ProjectRepository
}

export async function readProjects(
	deps: ReadProjectsDeps
): Promise<Project[]> {
	return deps.projects.list()
}

export async function readProjectById(
	deps: ReadProjectsDeps,
	id: string
): Promise<Project | null> {
	return deps.projects.getById(id)
}

// ============================================================================
// Class Wrapper for Container
// ============================================================================

export class ReadProjectUseCase {
	private projectRepo: ProjectRepository

	constructor(projectRepo: ProjectRepository) {
		this.projectRepo = projectRepo
	}

	async list(): Promise<{
		success: boolean
		data?: Project[]
		error?: string
	}> {
		try {
			const projects = await readProjects({ projects: this.projectRepo })
			return { success: true, data: projects }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to read projects'
			}
		}
	}

	async byId(id: string): Promise<{
		success: boolean
		data?: Project
		error?: string
	}> {
		try {
			const project = await readProjectById({ projects: this.projectRepo }, id)
			if (!project) {
				return { success: false, error: 'Project not found' }
			}
			return { success: true, data: project }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to read project'
			}
		}
	}
}
