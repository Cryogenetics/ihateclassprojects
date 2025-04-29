import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import {Form, useActionData, useNavigate, useLoaderData} from "@remix-run/react";
import {useState} from "react";
import {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {makeDBQuery} from "~/database";
import {Shop} from "~/database/schemas/types";

export const loader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params;
    if (!id) {
        throw new Error("Shop ID is required");
    }

    const [shop] = await makeDBQuery<Shop>(
        "SELECT * FROM shop WHERE shop_id = ?",
        [parseInt(id)]
    );

    if (!shop) {
        throw new Error("Shop not found");
    }

    return shop;
}

export const action = async ({params}: LoaderFunctionArgs) => {
    const {id} = params;
    if (!id) {
        return {error: "Shop ID is required"};
    }

    try {
        // First check if this shop has any mechanics
        const mechanics = await makeDBQuery(
            "SELECT COUNT(*) as count FROM mechanic WHERE shop_id = ?",
            [parseInt(id)]
        );

        if (mechanics[0].count > 0) {
            return {
                error: "Cannot delete shop with assigned mechanics. Reassign mechanics first."
            };
        }

        // Check if shop has any appointments
        const appointments = await makeDBQuery(
            "SELECT COUNT(*) as count FROM appointment WHERE shop_id = ?",
            [parseInt(id)]
        );

        if (appointments[0].count > 0) {
            return {
                error: "Cannot delete shop with scheduled appointments. Cancel or complete appointments first."
            };
        }

        // If no constraints, proceed with deletion
        await makeDBQuery("DELETE FROM shop WHERE shop_id = ?", [parseInt(id)]);
        return {success: true};
    } catch (error) {
        console.error("Error deleting shop:", error);
        return {error: "Failed to delete shop"};
    }
};

export default function DeleteModal() {
    const shop = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    // If deletion was successful, navigate back
    if (actionData?.success) {
        navigate("/authed/shops");
    }

    const onClose = () => {
        setOpened(false);
        navigate("/authed/shops");
    }

    return (
        <DeleteShopModal
            isOpen={opened}
            onClose={onClose}
            shop={shop as Shop}
            actionData={actionData}
        />
    );
}

const DeleteShopModal = ({
                             isOpen,
                             onClose,
                             shop,
                             actionData
                         }: {
    isOpen: boolean;
    onClose: () => void,
    shop: Shop,
    actionData: {
        success?: boolean,
        error?: string
    } | undefined
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Delete Shop
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        This action cannot be undone. Deleting a shop will permanently remove it from the system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Shop Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Shop ID:</span> {shop.shop_id}</p>
                                <p><span className="font-medium">Name:</span> {shop.shop_name}</p>
                                <p><span className="font-medium">Address:</span> {shop.address}</p>
                                <p><span className="font-medium">Phone:</span> {shop.phone}</p>
                            </div>
                        </div>

                        <p className="text-gray-700 font-medium">
                            Are you sure you want to delete this shop?
                        </p>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="flat"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="danger"
                                variant="solid"
                            >
                                Delete Shop
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};