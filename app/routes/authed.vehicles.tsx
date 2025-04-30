import {makeDBQuery} from "~/database";
import {Vehicle} from "~/database/schemas/types";
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

type customOutput = Vehicle & {
    firstname: string,
    lastname: string
}
export const loader = async () => {
    const vehicles = await makeDBQuery<customOutput>
    ("SELECT v.*, c.firstname, c.lastname FROM vehicle v JOIN customer c ON v.customer_id = c.customer_id");
    return vehicles;
}

export default function VehiclesIndex() {
    // Uncomment the line below to use actual data from the database
    // const vehicles = useLoaderData<typeof loader>();

    // Sample data for testing purposes
    const vehicles = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-background">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Customer Vehicles</h1>
                <Button
                    as={Link}
                    href="vehicles/create"
                    color="primary"
                    startContent={<span>+</span>}
                >
                    Add New Vehicle
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {vehicles.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No vehicles available</p>
                        <Button
                            as={Link}
                            href="vehicles/create"
                            color="primary"
                        >
                            Register New Vehicle
                        </Button>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[70vh]">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.VIN} vehicle={vehicle}/>
                        ))}
                    </div>
                )}
            </div>
            <Outlet/>
        </div>
    );
}

const VehicleCard = ({key, vehicle}: { key?: string, vehicle: customOutput }) => {
    return (
        <Card key={key} className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {vehicle.year}
                </span>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="space-y-2">
                    <p><span className="font-medium">VIN:</span> {vehicle.VIN}</p>
                    <p><span className="font-medium">Owner:</span> {vehicle.firstname} {vehicle.lastname}</p>
                    <p><span className="font-medium">Customer ID:</span> {vehicle.customer_id}</p>
                </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    as={Link}
                    href={`vehicles/${vehicle.VIN}/update`}
                    color="primary"
                    variant="flat"
                    size="sm"
                >
                    Edit
                </Button>
                <Button
                    as={Link}
                    href={`appointments/create?vin=${vehicle.VIN}`}
                    color="success"
                    variant="flat"
                    size="sm"
                >
                    Schedule Service
                </Button>
            </CardFooter>
        </Card>
    );
};