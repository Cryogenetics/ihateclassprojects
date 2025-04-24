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
    // const appointments = useLoaderData<typeof loader>();
    const appointments = [
        {
            appt_id: 1,
            VIN: "1HGCM82633A123456",
            mechanic_id: 3,
            shop_id: 1,
            scheduled_datetime: new Date("2023-12-15T10:30:00"),
            status: "scheduled",
        },
        {
            appt_id: 2,
            VIN: "WBAAA1305H2568190",
            mechanic_id: 1,
            shop_id: 2,
            scheduled_datetime: new Date("2023-12-16T13:15:00"),
            status: "in-progress",
        },
        {
            appt_id: 3,
            VIN: "JH4DA9360PS001252",
            mechanic_id: 2,
            shop_id: 1,
            scheduled_datetime: new Date("2023-12-17T09:00:00"),
            status: "completed",
        },
        {
            appt_id: 4,
            VIN: "2T1KR32E13C123456",
            mechanic_id: 3,
            shop_id: 3,
            scheduled_datetime: new Date("2023-12-20T11:45:00"),
            status: "scheduled",
        },
        {
            appt_id: 5,
            VIN: "1FTFW1EF3BFA12345",
            mechanic_id: 2,
            shop_id: 2,
            scheduled_datetime: new Date("2023-12-22T14:00:00"),
            status: "cancelled",
        },
        {
            appt_id: 6,
            VIN: "1G1YY22G565100001",
            mechanic_id: 1,
            shop_id: 1,
            scheduled_datetime: new Date("2023-12-26T10:00:00"),
            status: "scheduled",
        },
        {
            appt_id: 7,
            VIN: "JT2BG22K1X0123456",
            mechanic_id: 3,
            shop_id: 3,
            scheduled_datetime: new Date("2023-12-28T15:30:00"),
            status: "scheduled",
        },
        {
            appt_id: 8,
            VIN: "1ZVBP8CF7E5234567",
            mechanic_id: 2,
            shop_id: 1,
            scheduled_datetime: new Date("2023-12-30T13:00:00"),
            status: "scheduled",
        },
        {
            appt_id: 9,
            VIN: "WAUZZZ8E56A123456",
            mechanic_id: 1,
            shop_id: 2,
            scheduled_datetime: new Date("2024-01-03T09:30:00"),
            status: "scheduled",
        },
        {
            appt_id: 10,
            VIN: "5YJSA1DN5DFP12345",
            mechanic_id: 3,
            shop_id: 1,
            scheduled_datetime: new Date("2024-01-05T11:00:00"),
            status: "scheduled",
        },
        {
            appt_id: 11,
            VIN: "1GKKNXLS1KZ123456",
            mechanic_id: 2,
            shop_id: 3,
            scheduled_datetime: new Date("2024-01-08T14:45:00"),
            status: "scheduled",
        },
        {
            appt_id: 12,
            VIN: "JN1AZ4EH8FM123456",
            mechanic_id: 1,
            shop_id: 1,
            scheduled_datetime: new Date("2024-01-10T16:00:00"),
            status: "scheduled",
        },
        {
            appt_id: 13,
            VIN: "3VW4T7AU6KM123456",
            mechanic_id: 3,
            shop_id: 2,
            scheduled_datetime: new Date("2024-01-12T10:15:00"),
            status: "scheduled",
        },
        {
            appt_id: 14,
            VIN: "WDC0G4KB3KF123456",
            mechanic_id: 2,
            shop_id: 3,
            scheduled_datetime: new Date("2024-01-15T13:30:00"),
            status: "scheduled",
        },
        {
            appt_id: 15,
            VIN: "SAJWA0FSXCPR12345",
            mechanic_id: 1,
            shop_id: 1,
            scheduled_datetime: new Date("2024-01-18T15:00:00"),
            status: "scheduled",
        },
        {
            appt_id: 16,
            VIN: "SALSH23456A123456",
            mechanic_id: 3,
            shop_id: 2,
            scheduled_datetime: new Date("2024-01-22T09:45:00"),
            status: "scheduled",
        },
        {
            appt_id: 17,
            VIN: "JM1NDAC79G0123456",
            mechanic_id: 2,
            shop_id: 3,
            scheduled_datetime: new Date("2024-01-25T12:15:00"),
            status: "scheduled",
        },
        {
            appt_id: 18,
            VIN: "YV1LS55A7X1123456",
            mechanic_id: 1,
            shop_id: 1,
            scheduled_datetime: new Date("2024-01-29T14:30:00"),
            status: "scheduled",
        },
        {
            appt_id: 19,
            VIN: "ZFF75VFA9E0123456",
            mechanic_id: 3,
            shop_id: 2,
            scheduled_datetime: new Date("2024-02-01T11:30:00"),
            status: "scheduled",
        },
        {
            appt_id: 20,
            VIN: "SHHFK7H40KU123456",
            mechanic_id: 2,
            shop_id: 3,
            scheduled_datetime: new Date("2024-02-05T16:30:00"),
            status: "scheduled",
        }
    ];

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
            <p><span className="font-medium">Scheduled:</span> {appointment.scheduled_datetime.toTimeString()}</p>
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