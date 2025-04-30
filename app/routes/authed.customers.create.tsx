import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import {Form, useActionData, useNavigate} from "@remix-run/react";
import {useState} from "react";
import {makeDBQuery} from "~/database";
import type {Customer} from "~/database/schemas/types";

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const phone = formData.get("phone")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!firstname) fieldErrors.firstname = "First name is required";
    if (!lastname) fieldErrors.lastname = "Last name is required";
    if (!phone) fieldErrors.phone = "Phone number is required";

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        await makeDBQuery<Customer>(
            "INSERT INTO customer ( firstname, lastname, phone) VALUES ( ?, ?, ?)",
            [ firstname, lastname, phone]
        );

        return { success: true };
    } catch (error) {
        console.error("Error creating customer:", error);
        return { error: "Failed to create customer" };
    }
};

export default function CreateModal() {
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/customers");
    }

    return (
        <CreateCustomerModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
        />
    );
}

const CreateCustomerModal = ({
                                 isOpen,
                                 onClose,
                                 actionData,
                             }: {
    isOpen: boolean;
    onClose: () => void;
    actionData: {
        fieldErrors: Record<string, string>
        success?: undefined
        error?: undefined
    } | {
        success: boolean
        fieldErrors?: undefined
        error?: undefined
    } | {
        error: string
        fieldErrors?: undefined
        success?: undefined
    } | undefined;
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Add New Customer
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Customer successfully added!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="First Name"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Enter first name"
                                    isRequired={true}
                                    labelPlacement="outside"
                                    errorMessage={actionData?.fieldErrors?.firstname}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Last Name"
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Enter last name"
                                    isRequired={true}
                                    labelPlacement="outside"
                                    errorMessage={actionData?.fieldErrors?.lastname}
                                />
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Phone Number"
                                id="phone"
                                name="phone"
                                placeholder="Format: 555-123-4567"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.phone}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="flat"
                                color="danger"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                color="primary"
                            >
                                Add Customer
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};