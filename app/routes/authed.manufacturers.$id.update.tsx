import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import {Form, useActionData, useLoaderData, useNavigate, useParams} from "@remix-run/react";
import {useState} from "react";
import {makeDBQuery} from "~/database";
import type {Manufacturer} from "~/database/schemas/types";

export const loader = async ({params}: { params: { id: string } }) => {
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

    return { manufacturer };
};

export const action = async ({ request, params }: { request: Request, params: { id: string } }) => {
    const {id} = params;
    if (!id) {
        return { error: "Manufacturer ID is required" };
    }

    const formData = await request.formData();
    const manName = formData.get("manName")?.toString();
    const address = formData.get("address")?.toString();
    const phone = formData.get("phone")?.toString();
    const website = formData.get("website")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!manName) fieldErrors.manName = "Manufacturer name is required";
    if (!address) fieldErrors.address = "Address is required";
    if (!phone) fieldErrors.phone = "Phone number is required";
    if (!website) fieldErrors.website = "Website is required";

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        await makeDBQuery(
            "UPDATE manufacturer SET man_name = ?, address = ?, phone = ?, website = ? WHERE man_id = ?",
            [manName, address, phone, website, parseInt(id)]
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating manufacturer:", error);
        return { error: "Failed to update manufacturer" };
    }
};

export default function UpdateModal() {
    const params = useParams();
    const {manufacturer} = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/manufacturers");
    }

    return (
        <UpdateManufacturerModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            manufacturer={manufacturer}
        />
    );
}

const UpdateManufacturerModal = ({
                                     isOpen,
                                     onClose,
                                     actionData,
                                     manufacturer,
                                 }: {
    isOpen: boolean;
    onClose: () => void;
    manufacturer: Manufacturer;
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
                    Update Manufacturer: {manufacturer.man_name}
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Manufacturer successfully updated!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div>
                            <Input
                                label="Manufacturer ID"
                                id="manId"
                                name="manId"
                                value={manufacturer.man_id.toString()}
                                isDisabled={true}
                                labelPlacement="outside"
                            />
                        </div>

                        <div>
                            <Input
                                label="Manufacturer Name"
                                id="manName"
                                name="manName"
                                placeholder="Enter company name"
                                defaultValue={manufacturer.man_name}
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
                                defaultValue={manufacturer.address}
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
                                defaultValue={manufacturer.phone}
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
                                defaultValue={manufacturer.website}
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
                                Update Manufacturer
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};