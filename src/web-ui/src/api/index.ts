import { Zodios } from "@zodios/core";
import { z } from "zod";
import { FileMeta } from "./types";
import { HttpStatusCode } from "axios";
import { serverUrl } from "~/config";


const api = new Zodios([
    {
        method: "post",
        path: "/auth/login",
        alias: "login",
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
        path: "/auth/logout",
        alias: "logout",
        response: z.object({}),
    },
    {
        method: "get",
        path: "/auth/has",
        alias: "authExists",
        response: z.boolean(),
    },
    {
        method: "get",
        path: "/auth/is-logged-in",
        alias: "isLoggedIn",
        response: z.boolean(),
    },
    {
        method: "head",
        path: "/api/",
        alias: "checkAccess",
        response: z.unknown(),
    },
    {
        method: "get",
        path: "/api/meta/:path",
        alias: "getFileMeta",
        parameters: [{
            name: "path",
            type: "Path",
            schema: z.string(),
        }],
        response: FileMeta,
    },
    {
        method: "get",
        path: "/files/:path",
        alias: "rawFile",
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
    timeout: 20_000,
} });
api.axios.interceptors.response.use(null, (error) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
        // important: change with different router-provider
        window.location.assign(`${import.meta.env.BASE_URL}#/login`);
    }
    return Promise.reject(error);
});
export default api;
