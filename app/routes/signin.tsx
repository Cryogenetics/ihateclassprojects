import { Form } from "@remix-run/react";
import { Button, Input } from "@heroui/react";

export default function Signup() {
    return (
        <div className="w-full h-screen my-auto mx-auto flex items-center justify-center">
            <div className="flex flex-col items-center justify-center border p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                    Customer Sign Up
                </h1>
                <Form method="post" className="w-full flex flex-col">
                    <SignUpInput label="Email" text="email" />
                    <SignUpInput label="Username" text="username" />
                    <SignUpInput label="Password" text="password" />
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

function SignUpInput({text, label}: {text: string, label: string}): JSX.Element {
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
