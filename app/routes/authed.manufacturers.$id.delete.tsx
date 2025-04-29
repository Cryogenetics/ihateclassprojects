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
import {Manufacturer} from "~/database/schemas/types";

export const loader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params;
    if (!id) {
        throw new Error("Manufacturer ID is required");
    }

    const [manufacturer] = await makeDBQuery<Manufacturer>(
        "SELECT * FROM manufacturer WHERE man_id = ?",
        [parseInt(id)]
    );

    if (!manufacturer) {
        throw new Error("Manufacturer not found");
    }

    return manufacturer;
}

export const action = async ({params}: LoaderFunctionArgs) => {
    const {id} = params;
    if (!id) {
        return {error: "Manufacturer ID is required"};
    }

    try {
        // First check if this manufacturer has any associated parts
        const partManufacturers = await makeDBQuery(
            "SELECT COUNT(*) as count FROM part_manufacturer WHERE manufacturer_id = ?",
            [parseInt(id)]
        );

        if (partManufacturers[0].count > 0) {
            return {
                error: "Cannot delete manufacturer with associated parts. Remove part associations first."
            };
        }

        // If no constraints, proceed with deletion
        await makeDBQuery(
            "DELETE FROM manufacturer WHERE man_id = ?",
            [parseInt(id)]
        );
        return {success: true};
    } catch (error) {
        console.error("Error deleting manufacturer:", error);
        return {error: "Failed to delete manufacturer"};
    }
};

export default function DeleteModal() {
    const manufacturer = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    // If deletion was successful, navigate back
    if (actionData?.success) {
        navigate("/authed/manufacturers");
    }

    const onClose = () => {
        setOpened(false);
        navigate("/authed/manufacturers");
    }

    return (
        <DeleteManufacturerModal
            isOpen={opened}
            onClose={onClose}
            manufacturer={manufacturer as Manufacturer}
            actionData={actionData}
        />
    );
}

const DeleteManufacturerModal = ({
                                     isOpen,
                                     onClose,
                                     manufacturer,
                                     actionData
                                 }: {
    isOpen: boolean;
    onClose: () => void,
    manufacturer: Manufacturer,
    actionData: {
        success?: boolean,
        error?: string
    } | undefined
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Delete Manufacturer
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
                                        This action cannot be undone. Deleting a manufacturer will permanently remove it from the system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Manufacturer Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">ID:</span> {manufacturer.man_id}</p>
                                <p><span className="font-medium">Name:</span> {manufacturer.man_name}</p>
                                <p><span className="font-medium">Address:</span> {manufacturer.address}</p>
                                <p><span className="font-medium">Phone:</span> {manufacturer.phone}</p>
                                <p><span className="font-medium">Website:</span> {manufacturer.website}</p>
                            </div>
                        </div>

                        <p className="text-gray-700 font-medium">
                            Are you sure you want to delete this manufacturer?
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
                                Delete Manufacturer
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};