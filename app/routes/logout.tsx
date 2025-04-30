import {useLoaderData} from "@remix-run/react";

export const loader = async () => {
    // send header to clear cookie
    const headers = new Headers();
    headers.append("Set-Cookie", "jwt=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0");
    headers.append("Location", "/signin");
    headers.append("Cache-Control", "no-store");
    return new Response("Redirecting...", {
        status: 302,
        headers,
    });
}

export default function Logout() {
    useLoaderData()
    return (
        <div className="w-full h-screen my-auto mx-auto flex items-center justify-center">
            <div className="flex flex-col items-center justify-center border p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                    Logging out...
                </h1>
            </div>
        </div>
    );
}