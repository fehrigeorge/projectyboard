/**
 * Read Label Use Cases.
 */

import type { Label } from '@/backend/core/labels/entities'
import type { LabelRepository } from '@/backend/ports/label-repository'

export type ReadLabelsDeps = {
	labels: LabelRepository
}

export async function readLabels(deps: ReadLabelsDeps): Promise<Label[]> {
	return deps.labels.list()
}

export async function readLabelById(
	deps: ReadLabelsDeps,
	id: string
): Promise<Label | null> {
	return deps.labels.getById(id)
}

// ============================================================================
// Class Wrapper for Container
// ============================================================================

export class ReadLabelUseCase {
	private labelRepo: LabelRepository

	constructor(labelRepo: LabelRepository) {
		this.labelRepo = labelRepo
	}

	async list(): Promise<{
		success: boolean
		data?: Label[]
		error?: string
	}> {
		try {
			const labels = await readLabels({ labels: this.labelRepo })
			return { success: true, data: labels }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to read labels'
			}
		}
	}

	async byId(id: string): Promise<{
		success: boolean
		data?: Label
		error?: string
	}> {
		try {
			const label = await readLabelById({ labels: this.labelRepo }, id)
			if (!label) {
				return { success: false, error: 'Label not found' }
			}
			return { success: true, data: label }
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to read label'
			}
		}
	}
}
