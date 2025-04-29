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
import type {Manufacturer} from "~/database/schemas/types";

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const manId = formData.get("manId")?.toString();
    const manName = formData.get("manName")?.toString();
    const address = formData.get("address")?.toString();
    const phone = formData.get("phone")?.toString();
    const website = formData.get("website")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!manId) fieldErrors.manId = "Manufacturer ID is required";
    if (!manName) fieldErrors.manName = "Manufacturer name is required";
    if (!address) fieldErrors.address = "Address is required";
    if (!phone) fieldErrors.phone = "Phone number is required";
    if (!website) fieldErrors.website = "Website is required";

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        await makeDBQuery<Manufacturer>(
            "INSERT INTO manufacturer (man_id, man_name, address, phone, website) VALUES (?, ?, ?, ?, ?)",
            [parseInt(manId), manName, address, phone, website]
        );

        return { success: true };
    } catch (error) {
        console.error("Error creating manufacturer:", error);
        return { error: "Failed to create manufacturer" };
    }
};

export default function CreateModal() {
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/manufacturers");
    }

    return (
        <CreateManufacturerModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
        />
    );
}

const CreateManufacturerModal = ({
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
                    Add New Manufacturer
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Manufacturer successfully added!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div>
                            <Input
                                label="Manufacturer ID"
                                id="manId"
                                name="manId"
                                type="number"
                                placeholder="Enter manufacturer ID"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.manId}
                            />
                        </div>

                        <div>
                            <Input
                                label="Manufacturer Name"
                                id="manName"
                                name="manName"
                                placeholder="Enter company name"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.manName}
                            />
                        </div>

                        <div>
                            <Input
                                label="Address"
                                id="address"
                                name="address"
                                placeholder="Enter complete address"
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
                                placeholder="Format: +1-123-456-7890"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.phone}
                            />
                        </div>

                        <div>
                            <Input
                                label="Website"
                                id="website"
                                name="website"
                                placeholder="e.g. www.company.com (without https://)"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.website}
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
                                Add Manufacturer
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};