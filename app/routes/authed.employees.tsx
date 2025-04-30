import {makeDBQuery} from "~/database";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
} from "@heroui/react";
import {Outlet, useLoaderData} from "@remix-run/react";
import {Mechanic} from "~/database/schemas/types";

export const loader = async () => {
    const mechanics = await makeDBQuery<Mechanic>("SELECT * FROM mechanic");
    return mechanics;
}

export default function MechanicsList() {
    // Sample data - would normally come from the loader
    const mechanics = useLoaderData<typeof loader>()

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-background">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tuners-R-US Mechanics</h1>
                <Button
                    as={Link}
                    href="employees/create"
                    color="primary"
                    startContent={<span>+</span>}
                >
                    Add Mechanic
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {mechanics.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No mechanics available</p>
                        <Button
                            as={Link}
                            href="employees/create"
                            color="primary"
                        >
                            Add New Mechanic
                        </Button>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[calc(100vh-180px)]">
                        {mechanics.map((mechanic) => (
                            <MechanicCard mechanic={mechanic} key={mechanic.employee_id.toString()}/>
                        ))}
                    </div>
                )}
            </div>
            <Outlet/>
        </div>
    );
}

const MechanicCard = ({mechanic}: { mechanic: Mechanic }) => {
    // Map specialties to emojis based on the homepage services
    const specialtyIcons: Record<string, string> = {
        "Engine Tuning": "🏎️",
        "Turbo Installation": "💨",
        "ECU Remapping": "💻",
        "Suspension Mods": "🔧",
        "Custom Exhaust": "🔊"
    };

    // Determine specialty color based on the homepage services
    const specialtyColors: Record<string, string> = {
        "Engine Tuning": "bg-red-100 text-red-800",
        "Turbo Installation": "bg-blue-100 text-blue-800",
        "ECU Remapping": "bg-green-100 text-green-800",
        "Suspension Mods": "bg-yellow-100 text-yellow-800",
        "Custom Exhaust": "bg-purple-100 text-purple-800"
    };

    const specialtyColor = specialtyColors[mechanic.specialty] || "bg-gray-100 text-gray-800";
    const specialtyIcon = specialtyIcons[mechanic.specialty] || "🔧";

    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{mechanic.firstname} {mechanic.lastname}</h2>
                <span className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${specialtyColor}`}>
                    <span>{specialtyIcon}</span>
                    {mechanic.specialty}
                </span>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="space-y-2">
                    <p><span className="font-medium">ID:</span> {mechanic.employee_id}</p>
                    <p><span className="font-medium">Shop ID:</span> {mechanic.shop_id}</p>
                    <p><span className="font-medium">Phone:</span> {mechanic.phone}</p>
                </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    as={Link}
                    href={`employees/${mechanic.employee_id}/update`}
                    color="primary"
                    variant="flat"
                    size="sm"
                >
                    Edit
                </Button>
                <Button
                    as={Link}
                    href={`employees/${mechanic.employee_id}/delete`}
                    color="danger"
                    variant="flat"
                    size="sm"
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}