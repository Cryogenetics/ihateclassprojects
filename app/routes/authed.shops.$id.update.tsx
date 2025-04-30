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
import type {Shop} from "~/database/schemas/types";
import {LoaderFunctionArgs} from "@remix-run/node";

export const loader = async ({params}: LoaderFunctionArgs) => {
    try {
        // Fetch existing shop data
        const [existingShop] = await makeDBQuery<Shop>(
            "SELECT * FROM shop WHERE shop_id = ?",
            [params.id]
        );

        if (!existingShop) {
            throw new Error("Shop not found");
        }

        return {
            existingShop
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const action = async ({ request, params }: { request: Request, params: { id: string } }) => {

    const formData = await request.formData();
    const shopName = formData.get("shopName")?.toString();
    const address = formData.get("address")?.toString();
    const phone = formData.get("phone")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!shopName) fieldErrors.shopName = "Shop name is required";
    if (!address) fieldErrors.address = "Address is required";
    if (!phone) fieldErrors.phone = "Phone number is required";

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        const shopId = params.id;
        if (!shopId) {
            return { error: "Shop ID is required for updates" };
        }

        await makeDBQuery(
            "UPDATE shop SET shop_name = ?, address = ?, phone = ? WHERE shop_id = ?",
            [shopName, address, phone, shopId]
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating shop:", error);
        return { error: "Failed to update shop" };
    }
};

export default function UpdateModal() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/shops");
    }

    return (
        <UpdateShopModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            loaderData={loaderData}
        />
    );
}

const UpdateShopModal = ({
                             isOpen,
                             onClose,
                             actionData,
                             loaderData,
                         }: {
    isOpen: boolean;
    onClose: () => void;
    loaderData: {
        existingShop: Shop
    };
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
                    Update Shop: {loaderData.existingShop.shop_name}
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Shop successfully updated!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div>
                            <Input
                                label="Shop ID"
                                id="shopId"
                                name="shopId"
                                value={loaderData.existingShop.shop_id.toString()}
                                isDisabled={true}
                                labelPlacement="outside"
                            />
                        </div>

                        <div>
                            <Input
                                label="Shop Name"
                                id="shopName"
                                name="shopName"
                                placeholder="Enter shop name"
                                defaultValue={loaderData.existingShop.shop_name}
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
                                defaultValue={loaderData.existingShop.address}
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
                                defaultValue={loaderData.existingShop.phone}
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
                                Update Shop
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};