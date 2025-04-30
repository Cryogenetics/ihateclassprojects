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
import {Form, useActionData, useLoaderData, useNavigate} from "@remix-run/react";
import { useState } from "react";
import {makeDBQuery} from "~/database";
import {Customer} from "~/database/schemas/types";
import {AddButton} from "~/components/AddButton";

export const loader = async () => {

        // Fetch customers for dropdown
        const customers = await makeDBQuery<Customer>(
            "SELECT customer_id, firstname, lastname FROM customer ORDER BY lastname, firstname"
        );

        return {customers };
};


export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const vin = formData.get("vin")?.toString();
    const customerId = formData.get("customerId")?.toString();
    const make = formData.get("make")?.toString();
    const model = formData.get("model")?.toString();
    const year = formData.get("year")?.toString();

    console.log("submitted")
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
    console.log(fieldErrors);
    if (year) {
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
            fieldErrors.year = "Please enter a valid year";
        }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        await makeDBQuery(
            "INSERT INTO vehicle (VIN, customer_id, make, model, year) VALUES (?, ?, ?, ?, ?)",
            [vin, customerId, make, model, parseInt(year as string)]
        );

        return { success: true };
    } catch (error) {
        console.error("Error adding vehicle:", error);
        return { error: "Failed to add vehicle" };
    }
};

export default function VehicleModal() {
    const actionData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/vehicles");
    }

    return (
        <VehicleFormModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            loaderData={loaderData}
            mode="create"
        />
    );
}

const VehicleFormModal = ({
                              isOpen,
                              onClose,
                              actionData,
                              loaderData,
                              mode
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
    loaderData: {
        customers: Customer[]
    } | undefined;
    mode: "create" | "edit";
}) => {
    const isEdit = mode === "edit";
    const title = isEdit ? "Edit Vehicle Information" : "Register New Vehicle";
    const submitButtonText = isEdit ? "Update Vehicle" : "Add Vehicle";



    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
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
                            Vehicle successfully added!
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
                                maxLength={17}
                                minLength={17}
                                errorMessage={actionData?.fieldErrors?.vin}
                            />
                        </div>

                        <div>
                            {loaderData?.customers?.length ?
                            <Select
                                label="Vehicle Owner"
                                id="customerId"
                                name="customerId"
                                labelPlacement="outside"
                                isRequired={true}
                                errorMessage={actionData?.fieldErrors?.customerId}
                                renderValue={
                                    (selected) => {
                                        const selectedCustomer = loaderData.customers.find(customer => customer.customer_id === parseInt(selected[0].key as string));
                                        return <div>
                                            {selectedCustomer ? `${selectedCustomer.firstname} ${selectedCustomer.lastname}` : "not found somehow"}
                                        </div>
                                    }
                                }
                            >
                                {loaderData.customers.map(customer => (
                                    <SelectItem key={customer.customer_id.toString()}>
                                        {customer.firstname}{customer.lastname}
                                    </SelectItem>
                                ))}
                            </Select>: <Input disabled value={"No Customers Available, add one"} endContent={<AddButton href={"/authed/customers/create"}/>}/>}
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