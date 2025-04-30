import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import {Form, useActionData, useNavigate, useLoaderData} from "@remix-run/react";
import {useState} from "react";
import {LoaderFunctionArgs} from "@remix-run/node";
import {Vehicle} from "~/database/schemas/types";
import {makeDBQuery} from "~/database";

// Define a type that extends Vehicle with customer name fields
type VehicleWithOwner = Vehicle & {
    firstname: string;
    lastname: string;
};

// Define the return type for the action function
type ActionReturn =
    | { success: boolean; errorMessage?: undefined }
    | { success?: undefined; errorMessage: string };

export const loader = async ({params}: LoaderFunctionArgs) => {
    // Type params correctly - this is the key fix
    const {vin} = params;

    console.log(`Getting vehicle with VIN ${vin}`);


    if (!vin || typeof vin !== "string") {
        throw new Error("VIN must be a non-empty string.");
    }

    const vehicle = await makeDBQuery<VehicleWithOwner>(
        "SELECT v.*, c.firstname, c.lastname FROM vehicle v JOIN customer c ON v.customer_id = c.customer_id WHERE v.VIN = ?",
        [vin]
    );

    if (vehicle && vehicle.length > 0) {
        return vehicle[0];
    }

}

export const action = async ({params}: LoaderFunctionArgs): Promise<ActionReturn> => {
    const {vin} = params;

    console.log(`Deleting vehicle with VIN ${vin}`);

    try {
        await makeDBQuery<void>(
            "DELETE FROM vehicle WHERE VIN = ?",
            [vin]
        );
        return {success: true};
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return {errorMessage: "Failed to delete vehicle. It may have associated appointments or service records."};
    }
}

export default function DeleteVehicleModal() {
    const actionData = useActionData<typeof action>();
    const vehicle = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    // If delete was successful, navigate back to vehicles list
    if (actionData?.success) {
        navigate("/authed/vehicles");
        return null;
    }

    const onClose = () => {
        setOpened(false);
        navigate("/authed/vehicles");
    }

    return (
        <DeleteVehicleModalContent
            isOpen={opened}
            onClose={onClose}
            vehicle={vehicle as VehicleWithOwner}
            errorMessage={actionData?.errorMessage}
        />
    );
}

interface DeleteVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: VehicleWithOwner;
    errorMessage?: string;
}

const DeleteVehicleModalContent = ({
                                       isOpen,
                                       onClose,
                                       vehicle,
                                       errorMessage
                                   }: DeleteVehicleModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Delete Vehicle Record
                </ModalHeader>

                <ModalBody>
                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Warning</h3>
                            <p className="text-yellow-700 dark:text-yellow-300">
                                Deleting this vehicle will permanently remove it from the system. Any associated service
                                records may also be affected.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p><span className="font-medium">VIN:</span> {vehicle.VIN}</p>
                            <p><span
                                className="font-medium">Vehicle:</span> {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            <p><span className="font-medium">Owner:</span> {vehicle.firstname} {vehicle.lastname}</p>
                        </div>

                        <p className="font-medium text-gray-700 dark:text-gray-300 mt-4">
                            Are you sure you want to delete this vehicle record?
                        </p>

                        <div className="flex justify-end space-x-2">
                            <Button
                                onPress={onClose}
                                variant="flat"
                                color="default"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="danger"
                            >
                                Delete Vehicle
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};