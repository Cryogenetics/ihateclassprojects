import {makeDBQuery} from "~/database";
import {Shop} from "~/database/schemas/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
} from "@heroui/react";
import {Outlet} from "@remix-run/react";

export const loader = async () => {
    const shops = await makeDBQuery<Shop>("SELECT * FROM shop");
    return shops;
}

export default function ShopsList() {
    // Sample data - would normally come from the loader
    const shops = [
        {
            shop_id: 1,
            shop_name: "Downtown Tuning Center",
            address: "123 Main Street, Metropolis, NY 10001",
            phone: "555-123-4567"
        },
        {
            shop_id: 2,
            shop_name: "Eastside Performance",
            address: "456 Oak Avenue, Gotham, CA 90210",
            phone: "555-234-5678"
        },
        {
            shop_id: 3,
            shop_name: "Westend Auto Works",
            address: "789 Pine Road, Central City, IL 60601",
            phone: "555-345-6789"
        },
        {
            shop_id: 4,
            shop_name: "North County Customs",
            address: "101 Maple Drive, Starling, TX 75001",
            phone: "555-456-7890"
        },
        {
            shop_id: 5,
            shop_name: "South Bay Tuners",
            address: "202 Elm Street, Coast City, FL 33101",
            phone: "555-567-8901"
        },
        {
            shop_id: 6,
            shop_name: "Central Motorsports",
            address: "303 Cedar Blvd, Keystone, WA 98101",
            phone: "555-678-9012"
        }
    ];

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-background">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tuners-R-US Shops</h1>
                <Button
                    as={Link}
                    href="shops/create"
                    color="primary"
                    startContent={<span>+</span>}
                >
                    Add Shop
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {shops.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No shops available</p>
                        <Button
                            as={Link}
                            href="shops/create"
                            color="primary"
                        >
                            Add New Shop
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[calc(100vh-180px)]">
                        {shops.map((shop) => (
                            <ShopCard shop={shop} key={shop.shop_id.toString()} />
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}

const ShopCard = ({ shop }: { shop: Shop }) => {
    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{shop.shop_name}</h2>
                <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    Shop #{shop.shop_id}
                </span>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {shop.address}</p>
                    <p><span className="font-medium">Phone:</span> {shop.phone}</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            <span className="font-medium">Service Hours:</span> Mon-Fri: 8AM-6PM, Sat: 9AM-4PM
                        </p>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="flex justify-between">
                <Button
                    as={Link}
                    href={`shops/${shop.shop_id}/mechanics`}
                    color="primary"
                    variant="flat"
                    size="sm"
                >
                    View Mechanics
                </Button>
                <div className="flex gap-2">
                    <Button
                        as={Link}
                        href={`shops/${shop.shop_id}/update`}
                        color="primary"
                        variant="flat"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        as={Link}
                        href={`shops/${shop.shop_id}/delete`}
                        color="danger"
                        variant="flat"
                        size="sm"
                    >
                        Delete
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};