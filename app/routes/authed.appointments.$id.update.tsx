import {
    Button,
    DatePicker,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import {Form, useActionData, useLoaderData, useNavigate} from "@remix-run/react";
import {Textarea} from "@heroui/input";
import {useState} from "react";
import {makeDBQuery} from "~/database";
import {Appointment, Mechanic, Shop, Vehicle} from "~/database/schemas/types";
import {LoaderFunctionArgs} from "@remix-run/node";
import {fromDate, getLocalTimeZone, now} from "@internationalized/date";

export const loader = async ({params}: LoaderFunctionArgs) => {
    try {
        // Fetch vehicles
        const vehicles = await makeDBQuery<Vehicle>(
            "SELECT v.VIN, v.make, v.model, v.year, CONCAT(c.firstname, ' ', c.lastname) as owner FROM vehicle v JOIN customer c ON v.customer_id = c.customer_id ORDER BY v.make, v.model"
        );

        // Fetch mechanics (employees with role = 'mechanic')
        const mechanics = await makeDBQuery<Mechanic>(
            "SELECT employee_id, firstname, lastname FROM mechanic ORDER BY lastname, firstname"
        );

        // Fetch shops
        const shops = await makeDBQuery<Shop>(
            "SELECT shop_id, shop_name, address FROM shop ORDER BY shop_name"
        );

        const [existingAppointment] = await makeDBQuery<Appointment>(
            "SELECT * FROM appointment a WHERE a.appt_id = ?",
            [params.id]
        );
        return {
            vehicles,
            mechanics,
            shops,
            existingAppointment
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const action = async ({request}: { request: Request }) => {
    const formData = await request.formData();
    const vin = formData.get("vin")?.toString();
    const mechanicId = formData.get("mechanicId")?.toString();
    const shopId = formData.get("shopId")?.toString();
    const date = formData.get("date")?.toString();
    // const description = formData.get("description")?.toString();

    const fieldErrors: Record<string, string> = {};
    if (!vin) fieldErrors.vin = "VIN is required";
    if (!mechanicId) fieldErrors.mechanicId = "Mechanic is required";
    if (!shopId) fieldErrors.shopId = "Shop is required";
    if (!date) fieldErrors.date = "Date is required";

    if (Object.keys(fieldErrors).length > 0) {
        return {fieldErrors};
    }

    try {
        const appointmentId = formData.get("appointmentId")?.toString();
        if (!appointmentId) {
            return {error: "Appointment ID is required for updates"};
        }
        const scheduledDatetime = new Date(date as string);
        console.log(scheduledDatetime);
        await makeDBQuery(
            "UPDATE appointment SET VIN = ?, mechanic_id = ?, shop_id = ?, scheduled_datetime = ?, status = ? WHERE appt_id = ?",
            [vin, mechanicId, shopId, scheduledDatetime, "updated", appointmentId]
        );
        return {success: true};
    } catch (error) {
        console.error("Error updating appointment:", error);
        return {error: "Failed to update appointment"};
    }
};

export default function CreateModal() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = () => {
        setOpened(false);
        navigate("/authed/appointments");
    }

    return (
        <UpdateAppointmentModal
            isOpen={opened}
            onClose={onClose}
            actionData={actionData}
            loaderData={loaderData}
        />
    );
}

const UpdateAppointmentModal = ({
                                    isOpen,
                                    onClose,
                                    actionData,
                                    loaderData,
                                }: {
    isOpen: boolean;
    onClose: () => void;
    loaderData: {
        vehicles: Vehicle[]
        mechanics: Mechanic[]
        shops: Shop[],
        existingAppointment: Appointment

    }
    actionData: {
        fieldErrors: Record<string, string>
        success: undefined
        error: undefined
    } | {
        success: boolean
        fieldErrors: undefined
        error: undefined
    } | {
        error: string
        fieldErrors: undefined
        success: undefined
    } | undefined;
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Update Appointment
                </ModalHeader>

                <ModalBody>
                    {actionData?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {actionData.error}
                        </div>
                    )}

                    <Form method="post" className="space-y-6">
                        <div>
                            {loaderData.vehicles.length ?
                                <Select label={"Vehicle VIN"}
                                        id={"vin"}
                                        name={"vin"}
                                        placeholder={"Vehicle VIN"}
                                        labelPlacement="outside"
                                        isRequired={true}
                                        errorMessage={actionData?.fieldErrors?.vin}
                                        defaultSelectedKeys={[loaderData.existingAppointment.VIN]}
                                        renderValue={
                                            (selected) => {
                                                const selectedVehicle = loaderData.vehicles.find(vehicle => vehicle.VIN === selected[0].key);
                                                return <div>
                                                    {selectedVehicle ? `${selectedVehicle.VIN} - ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})` : "not found somehow"}
                                                </div>
                                            }
                                        }
                                >
                                    {
                                        loaderData.vehicles.map((vehicle) => (
                                            <SelectItem key={vehicle.VIN}>
                                                {vehicle.VIN} - {vehicle.make} {vehicle.model} ({vehicle.year})
                                            </SelectItem>
                                        ))
                                    }
                                </Select> : <Input disabled value={"No Vehicles Available, add one"}/>
                            }
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {loaderData.mechanics.length ? <Select
                                    label="Mechanic"
                                    id="mechanicId"
                                    name="mechanicId"
                                    labelPlacement="outside"
                                    isRequired={true}
                                    errorMessage={
                                        actionData?.fieldErrors?.mechanicId
                                    }
                                    defaultSelectedKeys={[loaderData.existingAppointment.mechanic_id.toString()]}
                                    renderValue={
                                        (selected) => {
                                            const selectedMechanic = loaderData.mechanics.find(mechanic => mechanic.employee_id === parseInt(selected[0].key as string));
                                            return <div>
                                                {selectedMechanic ? `${selectedMechanic.firstname} ${selectedMechanic.lastname}` : "not found somehow"}
                                            </div>
                                        }
                                    }
                                >
                                    {loaderData.mechanics.map((mechanic) => (
                                        <SelectItem key={mechanic.employee_id}>
                                            {mechanic.firstname} {mechanic.lastname}
                                        </SelectItem>
                                    ))}
                                </Select> : <Input disabled value={"No Mechanics Available, add one"}/>}
                            </div>

                            <div>
                                {loaderData.shops.length ? <Select
                                    label="Shop Location"
                                    id="shopId"
                                    name="shopId"
                                    labelPlacement="outside"
                                    isRequired={true}
                                    errorMessage={
                                        actionData?.fieldErrors?.shopId
                                    }
                                    defaultSelectedKeys={[loaderData.existingAppointment.shop_id.toString()]}
                                >
                                    {loaderData.shops.map((shop) => (
                                        <SelectItem key={shop.shop_id}>
                                            {shop.shop_name}
                                        </SelectItem>
                                    ))}
                                </Select> : <Input disabled value={"No Shops Available, create one"}/>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <DatePicker
                                    hideTimeZone
                                    showMonthAndYearPickers
                                    granularity={"minute"}
                                    label="Appointment Date"
                                    id="date"
                                    name="date"
                                    labelPlacement="outside"
                                    isRequired={true}
                                    minValue={now(getLocalTimeZone())}
                                    defaultValue={fromDate(loaderData.existingAppointment.scheduled_datetime, getLocalTimeZone())}
                                    errorMessage={actionData?.fieldErrors?.date}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <Textarea
                                label="Service Description"
                                id="description"
                                name="description"
                                labelPlacement="outside"
                                placeholder="Describe the service needed"
                                multiple={true}
                                rows={3}
                                defaultValue={""}
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
                                Update Appointment
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
        ;
};
