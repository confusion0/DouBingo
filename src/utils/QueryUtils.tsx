import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { useAuthToken } from "../context/AuthTokenContext";

async function getBackendJson(url: string, token: string | null) {
    console.log("FETCH")
    const response = await fetch("http://localhost:8000/" + url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const json = await response.json();
    console.log(json,"response")
    if(!response.ok) {
        throw new Error(json.error);
    }
    return json;
}

export function useBackendQuery<T>(url: string) {
    const { token } = useAuthToken();
    return useQuery<T>({
        queryKey: [url],
        queryFn: async () => await getBackendJson(url, token),
        staleTime: Infinity,
        gcTime: 0
    })
};

type DatalessUseQueryResult<T> = UseQueryResult<T> & {
    status: 'error' | 'pending';
};

export function renderDatalessQuery<T>(query: DatalessUseQueryResult<T>) {
    if(query.status === 'pending') {
        return (
            <p className="mt-4 sm:text-lg" style={{ margin: "30px 0", textAlign: "center" }}>
                Loading...
            </p>
        );
    } else if(query.status === 'error') {
        return (
            <p className="mt-4 sm:text-lg" style={{ margin: "30px 0", textAlign: "center" }}>
                Error: { query.error.message ?? "Something went wrong." }
            </p>
        );
    }
};
