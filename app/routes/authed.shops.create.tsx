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
import type {Shop} from "~/database/schemas/types";

export const action = async ({request}: { request: Request }) => {
    const formData = await request.formData();
    const shopName = formData.get("shopName")?.toString();
    const address = formData.get("address")?.toString();
    const phone = formData.get("phone")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!shopName) fieldErrors.shopName = "Shop name is required";
    if (!address) fieldErrors.address = "Address is required";
    if (!phone) fieldErrors.phone = "Phone number is required";
    if (Object.keys(fieldErrors).length > 0) {
        return {fieldErrors};
    }

    try {
        await makeDBQuery<Shop>(
            "INSERT INTO shop (shop_name, address, phone) VALUES (?, ?, ?)",
            [shopName, address, phone]
        );

        return {success: true};
    } catch (error) {
        console.error("Error creating shop:", error);
        return {error: "Failed to create shop"};
    }
};

export default function CreateModal() {
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/shops");
    }

    return (
        <CreateShopModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
        />
    );
}

const CreateShopModal = ({
                             isOpen,
                             onClose,
                             actionData,
                         }: {
    isOpen: boolean;
    onClose: () => void;
    actionData: {
        fieldErrors?: Record<string, string>
        success?: boolean
        error?: string
    } | undefined;
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Add New Shop
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Shop successfully added!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">


                        <div>
                            <Input
                                label="Shop Name"
                                id="shopName"
                                name="shopName"
                                placeholder="Enter shop name"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.shopName}
                            />
                        </div>

                        <div>
                            <Input
                                label="Address"
                                id="address"
                                name="address"
                                placeholder="Enter full address"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.address}
                            />
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
                                Add Shop
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};