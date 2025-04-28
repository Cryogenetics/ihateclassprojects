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
import { Outlet, useLoaderData} from "@remix-run/react";

export const loader = async () => {
    const vehicles = await makeDBQuery<Vehicle>("SELECT v.*, c.firstname, c.lastname FROM vehicle v JOIN customer c ON v.customer_id = c.customer_id");
    return vehicles;
}

export default function VehiclesIndex() {
    // Uncomment the line below to use actual data from the database
    // const vehicles = useLoaderData<typeof loader>();

    // Sample data for testing purposes
    const vehicles = [
        {
            VIN: "1HGCM82633A123456",
            customer_id: 1,
            make: "Honda",
            model: "Accord",
            year: 2020,
            firstname: "John",
            lastname: "Doe"
        },
        {
            VIN: "WBAAA1305H2568190",
            customer_id: 2,
            make: "BMW",
            model: "3 Series",
            year: 2019,
            firstname: "Jane",
            lastname: "Smith"
        },
        {
            VIN: "JH4DA9360PS001252",
            customer_id: 3,
            make: "Acura",
            model: "NSX",
            year: 2018,
            firstname: "Michael",
            lastname: "Johnson"
        },
        {
            VIN: "2T1KR32E13C123456",
            customer_id: 4,
            make: "Toyota",
            model: "Corolla",
            year: 2021,
            firstname: "Sarah",
            lastname: "Williams"
        },
        {
            VIN: "1FTFW1EF3BFA12345",
            customer_id: 5,
            make: "Ford",
            model: "F-150",
            year: 2022,
            firstname: "Robert",
            lastname: "Brown"
        },
        {
            VIN: "1G1YY22G565100001",
            customer_id: 6,
            make: "Chevrolet",
            model: "Corvette",
            year: 2020,
            firstname: "Emily",
            lastname: "Davis"
        },
        {
            VIN: "JT2BG22K1X0123456",
            customer_id: 7,
            make: "Toyota",
            model: "Camry",
            year: 2019,
            firstname: "David",
            lastname: "Miller"
        },
        {
            VIN: "1ZVBP8CF7E5234567",
            customer_id: 8,
            make: "Ford",
            model: "Mustang",
            year: 2021,
            firstname: "Jessica",
            lastname: "Wilson"
        },
        {
            VIN: "WAUZZZ8E56A123456",
            customer_id: 9,
            make: "Audi",
            model: "A4",
            year: 2022,
            firstname: "Thomas",
            lastname: "Taylor"
        },
        {
            VIN: "5YJSA1DN5DFP12345",
            customer_id: 10,
            make: "Tesla",
            model: "Model S",
            year: 2023,
            firstname: "Jennifer",
            lastname: "Anderson"
        }
    ];

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[70vh]">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.VIN} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}

const VehicleCard = ({key, vehicle}: {key?: string, vehicle: Vehicle & {firstname: string, lastname: string}}) => {
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
                    href={`vehicles/${vehicle.VIN}/service-history`}
                    color="secondary"
                    variant="flat"
                    size="sm"
                >
                    Service History
                </Button>
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