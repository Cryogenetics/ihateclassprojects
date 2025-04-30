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
import {makeDBQuery} from "~/database";
import {useState} from "react";
import {Mechanic, Shop} from "~/database/schemas/types";
import {LoaderFunctionArgs} from "@remix-run/node";

export const loader = async ({params}: LoaderFunctionArgs) => {
    try {
        // Fetch shops
        const shops = await makeDBQuery<Shop>(
            "SELECT shop_id, shop_name, address FROM shop ORDER BY shop_name"
        );

        // Fetch existing mechanic data
        const [existingMechanic] = await makeDBQuery<Mechanic>(
            "SELECT * FROM mechanic WHERE employee_id = ?",
            [params.id]
        );

        if (!existingMechanic) {
            throw new Error("Mechanic not found");
        }

        return {
            shops,
            existingMechanic
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const action = async ({ request, params }: { request: Request, params: { id: string } }) => {

    const formData = await request.formData();
    const shopId = formData.get("shopId")?.toString();
    const firstname = formData.get("firstname")?.toString();
    const lastname = formData.get("lastname")?.toString();
    const phone = formData.get("phone")?.toString();
    const specialty = formData.get("specialty")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!shopId) fieldErrors.shopId = "Shop is required";
    if (!firstname) fieldErrors.firstname = "First name is required";
    if (!lastname) fieldErrors.lastname = "Last name is required";
    if (!phone) fieldErrors.phone = "Phone number is required";
    if (!specialty) fieldErrors.specialty = "Specialty is required";

    if (Object.keys(fieldErrors).length > 0) {
        return { fieldErrors };
    }

    try {
        const employeeId = params.id;
        if (!employeeId) {
            return { error: "Employee ID is required for updates" };
        }

        await makeDBQuery(
            "UPDATE mechanic SET shop_id = ?, firstname = ?, lastname = ?, phone = ?, specialty = ? WHERE employee_id = ?",
            [parseInt(shopId as string), firstname, lastname, phone, specialty, employeeId]
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating mechanic:", error);
        return { error: "Failed to update mechanic" };
    }
};

export default function UpdateModal() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/employees");
    }

    return (
        <UpdateMechanicModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            loaderData={loaderData}
        />
    );
}

const UpdateMechanicModal = ({
                                 isOpen,
                                 onClose,
                                 actionData,
                                 loaderData,
                             }: {
    isOpen: boolean;
    onClose: () => void;
    loaderData: {
        shops: Shop[],
        existingMechanic: Mechanic,
    }
    actionData: {
        fieldErrors?: Record<string, string>
        success?: boolean
        error?: string
    } | undefined;
}) => {
    // Specialties that match with the homepage services
    const specialties = [
        "Engine Tuning",
        "Turbo Installation",
        "ECU Remapping",
        "Suspension Mods",
        "Custom Exhaust",
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Update Mechanic: {loaderData.existingMechanic.firstname} {loaderData.existingMechanic.lastname}
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Mechanic successfully updated!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Employee ID"
                                    id="employeeId"
                                    name="employeeId"
                                    value={loaderData.existingMechanic.employee_id.toString()}
                                    isDisabled={true}
                                    labelPlacement="outside"
                                />
                            </div>

                            <div>
                                <Select
                                    label="Shop Location"
                                    id="shopId"
                                    name="shopId"
                                    labelPlacement="outside"
                                    isRequired={true}
                                    defaultSelectedKeys={[loaderData.existingMechanic.shop_id.toString()]}
                                    errorMessage={actionData?.fieldErrors?.shopId}
                                >
                                    <SelectItem key="1">Downtown Shop (#1)</SelectItem>
                                    <SelectItem key="2">Westside Location (#2)</SelectItem>
                                    <SelectItem key="3">Northside Garage (#3)</SelectItem>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="First Name"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Enter first name"
                                    defaultValue={loaderData.existingMechanic.firstname}
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
                                    defaultValue={loaderData.existingMechanic.lastname}
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
                                defaultValue={loaderData.existingMechanic.phone}
                                isRequired={true}
                                labelPlacement="outside"
                                errorMessage={actionData?.fieldErrors?.phone}
                            />
                        </div>

                        <div>
                            <Select
                                label="Specialty"
                                id="specialty"
                                name="specialty"
                                labelPlacement="outside"
                                isRequired={true}
                                defaultSelectedKeys={[loaderData.existingMechanic.specialty]}
                                errorMessage={actionData?.fieldErrors?.specialty}
                            >
                                {specialties.map((specialty) => (
                                    <SelectItem key={specialty}>{specialty}</SelectItem>
                                ))}
                            </Select>
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
                                Update Mechanic
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};