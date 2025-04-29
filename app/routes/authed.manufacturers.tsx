import {makeDBQuery} from "~/database";
import {Manufacturer} from "~/database/schemas/types";
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

export const loader = async () => {
    const manufacturers = await makeDBQuery<Manufacturer>("SELECT * FROM manufacturer");
    return manufacturers;
}

export default function ManufacturersList() {
    // Sample data - would normally come from the loader
    const manufacturers = [
        {
            man_id: 1,
            man_name: "Toyota Motor Corporation",
            address: "1 Toyota-Cho, Toyota City, Aichi Prefecture, Japan",
            phone: "+81-565-28-2121",
            website: "www.toyota-global.com"
        },
        {
            man_id: 2,
            man_name: "Honda Motor Co., Ltd.",
            address: "2-1-1 Minami-Aoyama, Minato-ku, Tokyo, Japan",
            phone: "+81-3-3423-1111",
            website: "www.honda.com"
        },
        {
            man_id: 3,
            man_name: "BMW Group",
            address: "Petuelring 130, 80809 Munich, Germany",
            phone: "+49-89-382-0",
            website: "www.bmwgroup.com"
        },
        {
            man_id: 4,
            man_name: "Ford Motor Company",
            address: "1 American Road, Dearborn, MI 48126, USA",
            phone: "+1-800-392-3673",
            website: "www.ford.com"
        },
        {
            man_id: 5,
            man_name: "Volkswagen Group",
            address: "Berliner Ring 2, 38440 Wolfsburg, Germany",
            phone: "+49-5361-9-0",
            website: "www.volkswagenag.com"
        },
        {
            man_id: 6,
            man_name: "General Motors",
            address: "300 Renaissance Center, Detroit, MI 48265, USA",
            phone: "+1-313-556-5000",
            website: "www.gm.com"
        }
    ];

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-background">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Parts Manufacturers</h1>
                <Button
                    as={Link}
                    href="manufacturers/create"
                    color="primary"
                    startContent={<span>+</span>}
                >
                    Add Manufacturer
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {manufacturers.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No manufacturers available</p>
                        <Button
                            as={Link}
                            href="manufacturers/create"
                            color="primary"
                        >
                            Add New Manufacturer
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[calc(100vh-180px)]">
                        {manufacturers.map((manufacturer) => (
                            <ManufacturerCard key={manufacturer.man_id.toString()} manufacturer={manufacturer} />
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}

const ManufacturerCard = ({manufacturer}: {manufacturer: Manufacturer}) => {
    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{manufacturer.man_name}</h2>
                <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    ID: {manufacturer.man_id}
                </span>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {manufacturer.address}</p>
                    <p><span className="font-medium">Phone:</span> {manufacturer.phone}</p>
                    <p><span className="font-medium">Website:</span> <a href={`https://${manufacturer.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{manufacturer.website}</a></p>
                </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
                <Button
                    as={Link}
                    href={`manufacturers/${manufacturer.man_id}/parts`}
                    color="primary"
                    variant="flat"
                    size="sm"
                >
                    View Parts
                </Button>
                <Button
                    as={Link}
                    href={`manufacturers/${manufacturer.man_id}/update`}
                    color="primary"
                    variant="flat"
                    size="sm"
                >
                    Edit
                </Button>
                <Button
                    as={Link}
                    href={`manufacturers/${manufacturer.man_id}/delete`}
                    color="danger"
                    variant="flat"
                    size="sm"
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};