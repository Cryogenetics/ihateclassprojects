import {Form, useActionData} from "@remix-run/react";
import {Button, Input} from "@heroui/react";
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {makeDBQuery} from "~/database";
import {redirect} from "@remix-run/router";
import jsonwebtoken from "jsonwebtoken";
import {validateJWT} from "~/routes/middleware/auth.middleware";
import crypto from "node:crypto";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const cookies = request.headers.get("Cookie");
    const loggedIn = await validateJWT(cookies)
    if (loggedIn) {
        return redirect("/authed/appointments");
    }
    return null;
}


export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const username = formData.get("username")?.toString();
    const rawPassword = formData.get("password")?.toString();

    if (!email) throw new Response("Email Required", {status: 400, statusText: "Email Required"});
    if (!username) throw new Response("Username Required", {status: 400, statusText: "Username Required"});
    if (!rawPassword) throw new Response("Password Required", {status: 400, statusText: "Password Required"});


    const password = crypto.createHash('sha512').update(rawPassword).digest('hex');


    // run db query to check if user exists
    const userExists = (await makeDBQuery<{ username: string, password: string }>(`SELECT *
                                                                                   FROM users
                                                                                   WHERE username = ?`, [username]) ).length === 0;

    if (!userExists) {
        throw new Response("User already exists", {status: 400, statusText: "User already exists"});
    }

    // run db query to create user
    const createUser = await makeDBQuery(`INSERT INTO users (username, password)
                                          VALUES (?, ?)`, [username, password]);
    if (createUser.length !== 0) {
        throw new Response("Error creating user", {status: 400, statusText: "Error creating user"});
    }

    const jwt = jsonwebtoken.sign({username}, process.env.JWT_SECRET, {expiresIn: "1h"});
    const cookie = `jwt=${jwt}; HttpOnly; Path=/; SameSite=Strict`;
    const headers = new Headers();
    headers.append("Set-Cookie", cookie);
    headers.append("Location", "/authed");
    headers.append("Cache-Control", "no-store");
    return new Response("Redirecting...", {
        status: 302,
        headers,
    });
};

export default function Signup() {
    const actionData = useActionData();
    console.log(actionData, " this is in the client")
    return (
        <div className="w-full h-screen my-auto mx-auto flex items-center justify-center">
            <div className="flex flex-col items-center justify-center border p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                    Registration
                </h1>
                <Form method="post" className="w-full flex flex-col">
                    <SignUpInput label="Email" text="email"/>
                    <SignUpInput label="Username" text="username"/>
                    <SignUpInput label="Password" text="password"/>
                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            size="lg"
                            className="px-8 mt-5"
                        >
                            Sign Up
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

function SignUpInput({text, label}: { text: string, label: string }): JSX.Element {
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