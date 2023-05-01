import { z } from "zod";


const ResponseBase = z.object({
    basename: z.string(),
    path: z.string(),
    parent: z.string(),
});
export type ResponseBase = z.infer<typeof ResponseBase>


export const FileTypeResponse = ResponseBase.extend({
    type: z.literal("file"),
    size: z.number().min(0),
    mime: z.string().includes("/").optional(),
    extension: z.string().startsWith(".").optional(),
    dimensions: z.object({
        width: z.number().min(1),
        height: z.number().min(1),
    }).optional(),
    duration: z.number().min(0).optional(),
    has_video: z.boolean().optional(),
    has_audio: z.boolean().optional(),
});
export type FileTypeResponse = z.infer<typeof FileTypeResponse>;


export const DirectoryTypeResponse = ResponseBase.extend({
    type: z.literal("directory"),
});
export type DirectoryTypeResponse = z.infer<typeof DirectoryTypeResponse>


export const FileOrDirectory = FileTypeResponse.or(DirectoryTypeResponse);
export type FileOrDirectory = z.infer<typeof FileOrDirectory>;


export const DirectoryRootTypeResponse = DirectoryTypeResponse.extend({
    contents: FileOrDirectory.array(),
});
export type DirectoryRootTypeResponse = z.infer<typeof DirectoryRootTypeResponse>;


export const FileMeta = FileTypeResponse.or(DirectoryRootTypeResponse);
export type FileMeta = z.infer<typeof FileMeta>
