import { Form } from "@remix-run/react";
import { Button, Input } from "@heroui/react";
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {makeDBQuery} from "~/database";
import jsonwebtoken from "jsonwebtoken";
import {validateJWT} from "~/routes/middleware/auth.middleware";
import {redirect} from "@remix-run/router";

export const  loader = async (args: LoaderFunctionArgs)=>{
    const cookies = args.request.headers.get("Cookie");
    const loggedIn = await validateJWT(cookies)
    if (loggedIn) {
        return redirect("/authed");
    }

    return null;
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    if (!username) throw new Response("Username Required", { status: 400, statusText: "Username Required" });
    if (!password) throw new Response("Password Required", { status: 400, statusText: "Password Required" });
    // run db query to check if user exists
    const userExists = (await makeDBQuery<{username: string, password: string}>(`SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`)).length !== 0;
    if (!userExists) {
        throw new Response("Incorrect Login", { status: 400, statusText: "Incorrect Login" });
    }

    // user successfully logged in
    // set jwt cookie and redirect to /authed
    const jwt = jsonwebtoken.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const cookie = `jwt=${jwt}; HttpOnly; Path=/; SameSite=Strict; Secure`;
    const headers = new Headers();
    headers.append("Set-Cookie", cookie);
    headers.append("Location", "/authed");
    headers.append("Cache-Control", "no-store");
    return new Response("Redirecting...", {
        status: 302,
        headers,
    });



};

export default function SignIn() {
    return (
        <div className="w-full h-screen my-auto mx-auto flex items-center justify-center">
            <div className="flex flex-col items-center justify-center border p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                    Sign in
                </h1>
                <Form method="post" className="w-full flex flex-col">
                    <CustomInput label="Username" text="username" />
                    <CustomInput label="Password" text="password" />
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            size="lg"
                            className="px-8 mt-5"
                        >
                            Sign In
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

function CustomInput({text, label}: {text: string, label: string}): JSX.Element {
    return (
            <Input
                id={text}
                name={text}
                type={text}
                label={label}
                labelPlacement="outside"
                className="w-full px-5 pb-1.5"
                required
            />
    );
}
