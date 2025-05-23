import {makeDBQuery} from "~/database";
import {Customer} from "~/database/schemas/types";
import {Button, Card, CardBody, CardFooter, CardHeader, Divider, Link,} from "@heroui/react";
import {Outlet, useLoaderData} from "@remix-run/react";

export const loader = async () => {
    return await makeDBQuery<Customer>("SELECT * FROM customer");
}

export default function CustomersList() {
    // Sample data - would normally come from the loader
    const customers = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto p-6 max-w-5xl bg-background">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tuners-R-US Customers</h1>
                <Button
                    as={Link}
                    href="customers/create"
                    color="primary"
                    startContent={<span>+</span>}
                >
                    Add Customer
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                {customers.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">No customers available</p>
                        <Button
                            as={Link}
                            href="customers/create"
                            color="primary"
                        >
                            Add New Customer
                        </Button>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 max-h-[calc(100vh-180px)]">
                        {customers.map((customer) => (
                            <CustomerCard customer={customer} key={customer.customer_id.toString()}/>
                        ))}
                    </div>
                )}
            </div>
            <Outlet/>
        </div>
    );
}

const CustomerCard = ({customer}: { customer: Customer }) => {
    return (
        <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{customer.firstname} {customer.lastname}</h2>
                <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Customer #{customer.customer_id}
                </span>
            </CardHeader>
            <Divider/>
            <CardBody>
                <div className="space-y-2">
                    <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Customer
                            since: {new Date().getFullYear() - Math.floor(Math.random() * 5)}</p>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        as={Link}
                        href={`customers/${customer.customer_id}/update`}
                        color="primary"
                        variant="flat"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        as={Link}
                        href={`customers/${customer.customer_id}/delete`}
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