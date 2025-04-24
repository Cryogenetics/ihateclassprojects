import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import {Form, useActionData, useNavigate, useLoaderData} from "@remix-run/react";
import { useState } from "react";
import {ActionFunctionArgs} from "@remix-run/node";
import {Appointment} from "~/database/schemas/types";


export const loader = async ({ params }: ActionFunctionArgs) => {
    console.log(`getting appointment ${params.id}`)
    return {} as Appointment;
}

export const action = async ({ params }: ActionFunctionArgs) => {
   console.log(`would've deleted appointment ${params.id}`);
    return true
};

export default function CreateModal() {
    const actionData = useActionData<typeof action>();
    const loaderData = useLoaderData<typeof loader>();

    const navigate = useNavigate();
    const [opened, setOpened] = useState(true);

    const onClose = ()=> {
        setOpened(false);
        navigate("/authed/appointments");
    }

    return (
        <DeleteAppointmentModal
            isOpen={opened}
            onClose={onClose}
            appointment={loaderData}
        />
    );
}

const DeleteAppointmentModal = ({
                                    isOpen,
                                    onClose,
    appointment
                                }: {
    isOpen: boolean;
    onClose: () => void,
    appointment: Appointment}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
                <ModalHeader className="text-2xl font-bold">
                    Deleting Appointment {appointment.appt_id}
                </ModalHeader>

                <ModalBody>
                    <Form method="post" className="space-y-6">
                        <p>
                            VIN: {appointment.VIN}
                        </p>
                        <p>
                            Status: {appointment.status}
                        </p>
                        <p>
                            Are you sure you want to delete this appointment?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="submit"
                                color="danger"
                            >
                                Delete
                            </Button>
                            <Button
                                onPress={onClose}
                                color="primary"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
