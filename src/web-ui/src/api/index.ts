import { Zodios } from "@zodios/core";
import { z } from "zod";
import { FileMeta, FileOrDirectory } from "./types";
import { HttpStatusCode } from "axios";
import { serverUrl } from "~/config";


const api = new Zodios([
    {
        method: "post",
        alias: "login",
        path: "/auth/login",
        parameters: [{
            name: "body",
            type: "Body",
            schema: z.object({
                username: z.string().nonempty(),
                password: z.string().nonempty(),
            }),
        }],
        response: z.object({}),
    },
    {
        method: "post",
        alias: "logout",
        path: "/auth/logout",
        response: z.object({}),
    },
    {
        method: "get",
        alias: "authExists",
        path: "/auth/has",
        response: z.boolean(),
    },
    {
        method: "get",
        alias: "isLoggedIn",
        path: "/auth/is-logged-in",
        response: z.boolean(),
    },
    {
        method: "head",
        alias: "checkAccess",
        path: "/api/",
        response: z.unknown(),
    },
    {
        method: "get",
        alias: "getFileMeta",
        path: "/api/meta/:path",
        parameters: [{
            name: "path",
            type: "Path",
            schema: z.string(),
        }],
        response: FileMeta,
    },
    {
        method: "get",
        alias: "search",
        path: "/api/search/:source",
        parameters: [{
            name: "source",
            type: "Path",
            schema: z.string(),
        }, {
            name: "query",
            type: "Query",
            schema: z.string(),
        }, {
            name: "mode",
            type: "Query",
            schema: z.literal("fnmatch").or(z.literal("regex")).optional(),
        }, {
            name: "sensitive",
            type: "Query",
            schema: z.boolean().optional(),
        }, {
            name: "files",
            type: "Query",
            schema: z.boolean().optional(),
        }, {
            name: "directories",
            type: "Query",
            schema: z.boolean().optional(),
        }],
        response: FileOrDirectory.array(),
    },
    {
        method: "get",
        alias: "rawFile",
        path: "/files/:path",
        parameters: [{
            name: "path",
            type: "Path",
            schema: z.string(),
        }],
        response: z.string(),
    },
], { axiosConfig: {
    baseURL: serverUrl("/"),
    withCredentials: true,
    timeout: 10_000,
} });
api.axios.interceptors.response.use(null, (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
        // important: change with different router-provider
        window.location.assign(`${import.meta.env.BASE_URL}#/login`);
    }
    return Promise.reject(error);
});
export default api;
