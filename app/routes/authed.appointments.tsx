import {makeDBQuery} from "~/database";
import {Appointment} from "~/database/schemas/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
} from "@heroui/react";
import { Outlet, useLoaderData} from "@remix-run/react";
export const loader = async () => {
    const appointments = await makeDBQuery<Appointment>("SELECT * FROM appointment");
    return appointments;
}



export default function IndexT() {
    const appointments = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-background">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Upcoming Appointments</h1>
                <Button
                    as={Link}
                    href="appointments/create"
                    color="primary"
                    startContent={<span>+</span>}
                >
                    New Appointment
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {appointments.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No appointments available</p>
                        <Button
                            as={Link}
                            href="appointments/create"
                            color="primary"
                        >
                            Create New Appointment
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[70vh]">
                        {appointments.map((appointment) => (
                            <AppointmentCard key={appointment.appt_id.toString()} appointment={appointment} />
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}



const AppointmentCard = ({key, appointment}: {key:string, appointment: Appointment})=>{
    return <Card key={key} className="border border-gray-200 dark:border-gray-700">
    <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Appointment #{appointment.appt_id}</h2>
        <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                    {appointment.status}
                                </span>
    </CardHeader>
    <Divider/>
    <CardBody>
        <div className="space-y-2">
            <p><span className="font-medium">VIN:</span> {appointment.VIN}</p>
            <p><span className="font-medium">Mechanic ID:</span> {appointment.mechanic_id}</p>
            <p><span className="font-medium">Shop ID:</span> {appointment.shop_id}</p>
            <p><span className="font-medium">Scheduled:</span> {formatTimeString(appointment.scheduled_datetime)}</p>
        </div>
    </CardBody>
    <CardFooter className="flex justify-end gap-2">
        <Button
            as={Link}
            href={`appointments/${appointment.appt_id}/update`}
            color="primary"
            variant="flat"
            size="sm"
        >
            Edit
        </Button>
        <Button
            as={Link}
            href={`appointments/${appointment.appt_id}/delete`}
            color="danger"
            variant="flat"
            size="sm"
        >
            Delete
        </Button>
    </CardFooter>
</Card>}


const formatTimeString = (timeString: Date) =>{
    return timeString.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}