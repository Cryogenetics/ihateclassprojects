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
import {Form, useActionData, useNavigate, useLoaderData} from "@remix-run/react";
import {useState} from "react";
import {makeDBQuery} from "~/database";
import type {Mechanic, Shop} from "~/database/schemas/types";
import {AddButton} from "~/components/AddButton";

export const loader = async () => {
    try {
        // Fetch shops
        const shops = await makeDBQuery<Shop>(
            "SELECT shop_id, shop_name, address FROM shop ORDER BY shop_name"
        );

        return {shops};
    } catch (error) {
        console.error("Error loading shop data:", error);
        throw new Response("Failed to load shop data", {status: 500});
    }
};

export const action = async ({request}: { request: Request }) => {
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
        return {fieldErrors};
    }

    try {
        await makeDBQuery<Mechanic>(
            "INSERT INTO mechanic (shop_id, firstname, lastname, phone, specialty) VALUES ( ?, ?, ?, ?, ?)",
            [parseInt(shopId as string), firstname, lastname, phone, specialty]
        );

        return {success: true};
    } catch (error) {
        console.error("Error creating mechanic:", error);
        return {error: "Failed to create mechanic"};
    }
};

export default function CreateModal() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/employees");
    }

    return (
        <CreateMechanicModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            loaderData={loaderData}
        />
    );
}

const CreateMechanicModal = ({
                                 isOpen,
                                 onClose,
                                 actionData,
                                 loaderData,
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
        shops: Shop[]
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
                    Add New Mechanic
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    {actionData?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Mechanic successfully added!
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                {loaderData?.shops?.length ?
                                    <Select
                                        label="Shop Location"
                                        id="shopId"
                                        name="shopId"
                                        labelPlacement="outside"
                                        isRequired={true}
                                        errorMessage={actionData?.fieldErrors?.shopId}
                                    >
                                        {loaderData.shops.map((shop) => (
                                            <SelectItem key={shop.shop_id}>
                                                {shop.shop_name}
                                            </SelectItem>
                                        ))}
                                    </Select> : <Input disabled value={"No Shops Available, create one"}
                                                       endContent={<AddButton href={"/authed/shops/create"}/>}/>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="First Name"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Enter first name"
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
                                Add Mechanic
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};