import jsonwebtoken from "jsonwebtoken";
import {redirect} from "@remix-run/router";

export async function validateJWT(headers: string | null) {
    console.log(headers)
    if (headers) {
        const jwt = headers.split(";").find(cookie => cookie.trim().startsWith("jwt="));
        if (jwt) {
            const token = jwt.split("=")[1];
            console.log(token)
            try {
                const decoded = await jsonwebtoken.verify(token, process.env.JWT_SECRET);
                return decoded;
            } catch (e) {
                console.log(e);
                return false
            }
        }
    }
    return false
}

export async function getUser(request: Request): Promise<Response | string> {
    const cookies = request.headers.get("Cookie");
    const decoded = await validateJWT(cookies)
    console.log(decoded, "exists should")
    if (!decoded) {
        return redirect("/signin");
    }
    console.log(decoded)
    return decoded.username;
}