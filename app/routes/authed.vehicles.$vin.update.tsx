import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/router";
import { useState } from "react";
import {makeDBQuery} from "~/database";
import {Customer, Vehicle} from "~/database/schemas/types";

export const loader = async ({ params }: { params: { vin: string } }) => {
    const { vin } = params;

    if (!vin) {
        throw new Error("Vehicle VIN is required");
    }

    try {
        // Fetch vehicle
        const [vehicle] = await makeDBQuery<Vehicle>(
            "SELECT * FROM vehicle WHERE VIN = ?",
            [vin]
        );

        if (!vehicle) {
            throw new Error("Vehicle not found");
        }

        // Fetch customers for dropdown
        const customers = await makeDBQuery<Customer>(
            "SELECT customer_id, firstname, lastname FROM customer ORDER BY lastname, firstname"
        );

        return { vehicle, customers };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const vin = formData.get("vin")?.toString();
    const customerId = formData.get("customerId")?.toString();
    const make = formData.get("make")?.toString();
    const model = formData.get("model")?.toString();
    const year = formData.get("year")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!vin) fieldErrors.vin = "VIN is required";
    if (!customerId) fieldErrors.customerId = "Customer is required";
    if (!make) fieldErrors.make = "Make is required";
    if (!model) fieldErrors.model = "Model is required";
    if (!year) fieldErrors.year = "Year is required";

    // Validate VIN format
    if (vin && (vin.length !== 17)) {
        fieldErrors.vin = "VIN must be 17 characters";
    }

    // Validate year is a number and within reasonable range
    const yearNum = parseInt(year as string);

    if (year) {
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            fieldErrors.year = "Please enter a valid year";
        }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        await makeDBQuery(
            "UPDATE vehicle SET customer_id = ?, make = ?, model = ?, year = ? WHERE VIN = ?",
            [customerId, make, model, yearNum, vin]
        );

        console.log("Vehicle added:", { vin, customerId, make, model, year });
        return redirect("/authed/vehicles");
    } catch (error) {
        console.error("Error adding vehicle:", error);
        return { error: "Failed to add vehicle" };
    }
};

export default function CreateVehicleModal() {
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/vehicles");
    }

    // Check if we have successful action data and close the modal
    if (actionData?.success) {
        onClose();
    }

    return (
        <VehicleFormModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
        />
    );
}

const VehicleFormModal = ({
                              isOpen,
                              onClose,
                              actionData,
                              existingData
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
    existingData?: {
        VIN: string;
        customer_id: number;
        make: string;
        model: string;
        year: number;
    };
}) => {
    const isEdit = !!existingData;
    const title = isEdit ? "Edit Vehicle Information" : "Register New Vehicle";
    const submitButtonText = isEdit ? "Update Vehicle" : "Add Vehicle";

    // Sample customer data
    const customers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Michael Johnson" },
        { id: 4, name: "Sarah Williams" },
        { id: 5, name: "Robert Brown" },
        { id: 6, name: "Emily Davis" },
        { id: 7, name: "David Miller" },
        { id: 8, name: "Jessica Wilson" },
        { id: 9, name: "Thomas Taylor" },
        { id: 10, name: "Jennifer Anderson" }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    {title}
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Vehicle successfully {isEdit ? "updated" : "added"}!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div>
                            <Input
                                label="Vehicle Identification Number (VIN)"
                                id="vin"
                                name="vin"
                                placeholder="Enter 17-character VIN"
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.vin}
                                defaultValue={existingData?.VIN}
                                isDisabled={isEdit} // VIN shouldn't be changed if editing
                            />
                            {isEdit && <input type="hidden" name="vin" value={existingData?.VIN} />}
                        </div>

                        <div>
                            <Select
                                label="Vehicle Owner"
                                id="customerId"
                                name="customerId"
                                labelPlacement="outside"
                                isRequired={true}
                                errorMessage={actionData?.fieldErrors?.customerId}
                                defaultSelectedKeys={existingData ? [existingData.customer_id.toString()] : undefined}
                            >
                                {customers.map(customer => (
                                    <SelectItem key={customer.id.toString()}>
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    label="Make"
                                    id="make"
                                    name="make"
                                    placeholder="e.g. Toyota"
                                    labelPlacement="outside"
                                    isRequired={true}
                                    errorMessage={actionData?.fieldErrors?.make}
                                    defaultValue={existingData?.make}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Model"
                                    id="model"
                                    name="model"
                                    placeholder="e.g. Camry"
                                    labelPlacement="outside"
                                    isRequired={true}
                                    errorMessage={actionData?.fieldErrors?.model}
                                    defaultValue={existingData?.model}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Year"
                                    id="year"
                                    name="year"
                                    placeholder="e.g. 2022"
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    labelPlacement="outside"
                                    isRequired={true}
                                    errorMessage={actionData?.fieldErrors?.year}
                                    defaultValue={existingData?.year?.toString()}
                                />
                            </div>
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
                                {submitButtonText}
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};