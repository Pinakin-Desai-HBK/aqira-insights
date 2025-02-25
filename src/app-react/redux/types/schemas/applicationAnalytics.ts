import { z } from "zod";

const SystemSchema = z.object({
  devBuild: z.string(),
  application: z.string(),
  qaRun: z.boolean(),
  os: z.string(),
  osDescription: z.string(),
  originator: z.string(),
  language: z.string(),
  country: z.string(),
  applicationInfo: z.object({
    productName: z.string(),
    release: z.string(),
    productVersions: z.record(z.string(), z.string()),
    componentVersions: z.record(z.string(), z.string())
  })
});

export const ApplicationAnalyticsSchema = z.object({
  systemSettings: SystemSchema,
  feedbackCategories: z.object({
    categories: z.array(z.object({ label: z.string(), value: z.string() }))
  }),
  doesUserConsent: z.boolean(),
  canConnectToElasticsearch: z.boolean()
});

export type ApplicationAnalytics = z.infer<typeof ApplicationAnalyticsSchema>;

export const FeedbackResponseSchema = z.object({
  id: z.string().uuid(),
  systemProperties: SystemSchema,
  feedbackRating: z.number(),
  improvementOptions: z.array(z.string()),
  timestamp: z.string().datetime()
});

export type FeedbackResponseApi = z.infer<typeof FeedbackResponseSchema>;
