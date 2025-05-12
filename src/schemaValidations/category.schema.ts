import { DishSchema } from './dish.schema'
import z from 'zod'

export const CreateCategoryBody = z.object({
  name: z.string().min(1).max(256),
  description: z.string().max(10000)
})

export type CreateCategoryBodyType = z.TypeOf<typeof CreateCategoryBody>

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  dishes: z.array(DishSchema),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const CategoryRes = z.object({
  data: CategorySchema,
  message: z.string()
})

export type CategoryResType = z.TypeOf<typeof CategoryRes>

export const CategoryListRes = z.object({
  data: z.array(CategorySchema),
  message: z.string()
})

export type CategoryListResType = z.TypeOf<typeof CategoryListRes>

export const UpdateCategoryBody = CreateCategoryBody

export type UpdateCategoryBodyType = z.TypeOf<typeof UpdateCategoryBody>