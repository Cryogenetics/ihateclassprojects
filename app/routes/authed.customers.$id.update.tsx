import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import {Form, useActionData, useLoaderData, useNavigate} from "@remix-run/react";
import {makeDBQuery} from "~/database";
import {useState} from "react";
import type {Customer} from "~/database/schemas/types";
import {LoaderFunctionArgs} from "@remix-run/node";

export const loader = async ({params}: LoaderFunctionArgs) => {
    try {
        const id = params.id;
        if (!id) {
            throw new Error("Customer ID is required");
        }

        const customers = await makeDBQuery<Customer>(
            "SELECT * FROM customer WHERE customer_id = ?",
            [parseInt(id)]
        );

        if (!customers || customers.length === 0) {
            throw new Error("Customer not found");
        }

        return {
            customer: customers[0]
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const action = async ({ request, params }: { request: Request, params: { id: string } }) => {


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
        if (!params.id) {
            return {error: "Customer ID is required for updates"};
        }

        await makeDBQuery(
            "UPDATE customer SET firstname = ?, lastname = ?, phone = ? WHERE customer_id = ?",
            [firstname, lastname, phone, parseInt(params.id)]
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating customer:", error);
        return { error: "Failed to update customer" };
    }
};

export default function UpdateModal() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/customers");
    }

    return (
        <UpdateCustomerModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            loaderData={loaderData}
        />
    );
}

const UpdateCustomerModal = ({
                                 isOpen,
                                 onClose,
                                 actionData,
                                 loaderData,
                             }: {
    isOpen: boolean;
    onClose: () => void;
    loaderData: {
        customer: Customer
    }
    actionData: {
        fieldErrors: Record<string, string>
        success: undefined
        error: undefined
    } | {
        success: boolean
        fieldErrors: undefined
        error: undefined
    } | {
        error: string
        fieldErrors: undefined
        success: undefined
    } | undefined;
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Update Customer: {loaderData.customer.firstname} {loaderData.customer.lastname}
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Customer successfully updated!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div>
                            <Input
                                label="Customer ID"
                                id="customerId"
                                name="customerId"
                                value={loaderData.customer.customer_id.toString()}
                                isDisabled={true}
                                labelPlacement="outside"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="First Name"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Enter first name"
                                    defaultValue={loaderData.customer.firstname}
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
                                    defaultValue={loaderData.customer.lastname}
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
                                defaultValue={loaderData.customer.phone}
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
                                Update Customer
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};