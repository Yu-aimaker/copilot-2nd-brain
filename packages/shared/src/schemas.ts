import { z } from 'zod';

// Input schemas for API endpoints
export const CreateSourceInputSchema = z.object({
  content: z.string().min(1),
  mediaType: z.string().optional(), // Auto-detected if not provided
  projectId: z.string().uuid().optional(),
});

export type CreateSourceInput = z.infer<typeof CreateSourceInputSchema>;

export const UpdateSourceInputSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  projectId: z.string().uuid().optional().nullable(),
});

export type UpdateSourceInput = z.infer<typeof UpdateSourceInputSchema>;

export const CreateProjectInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().default('#3B82F6'),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

export const CreateActionInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  projectId: z.string().uuid().optional(),
  sourceIds: z.array(z.string().uuid()).default([]),
  dueDate: z.string().datetime().optional(),
});

export type CreateActionInput = z.infer<typeof CreateActionInputSchema>;

export const UpdateActionInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export type UpdateActionInput = z.infer<typeof UpdateActionInputSchema>;

export const GetSourcesInputSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  projectId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  mediaType: z.string().optional(),
});

export type GetSourcesInput = z.infer<typeof GetSourcesInputSchema>;

export const GetActionsInputSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  completed: z.boolean().optional(),
  projectId: z.string().uuid().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export type GetActionsInput = z.infer<typeof GetActionsInputSchema>;
