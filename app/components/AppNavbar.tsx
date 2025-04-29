import {Navbar, NavbarBrand, NavbarItem} from "@heroui/navbar";
import {Button, Link, NavbarContent} from "@heroui/react";

export default function AppNavbar() {
    return <Navbar
        isBordered={true}
        className="shadow-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
    >
        <NavbarBrand>
            <Link href="/authed/appointments" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-red-500"
                    >
                        <path
                            d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"
                            fill="currentColor"
                        />
                        <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
                        <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
                    </svg>
                </div>
                <div>
                    <span className="font-extrabold text-lg">
                        <span className="text-red-500">T</span>
                        <span className="text-blue-500">U</span>
                        <span className="text-green-500">N</span>
                        <span className="text-yellow-400">E</span>
                        <span className="text-purple-500">R</span>
                        <span className="text-red-500">S</span>
                        <span className="text-white">-</span>
                        <span className="text-blue-500">R</span>
                        <span className="text-white">-</span>
                        <span className="text-green-500">U</span>
                        <span className="text-yellow-400">S</span>
                    </span>
                </div>
            </Link>
        </NavbarBrand>
        <NavbarContent justify={"center"}>
            <NavbarItem>
                <Link color="foreground" href={"/authed/appointments"} className="font-medium">Appointments</Link>
            </NavbarItem>
            <NavbarItem>
                <Link color="foreground" href={"/authed/employees"} className="font-medium">Employees</Link>
                <Link color="foreground" href={"/authed/shops"} className="font-medium">Shops</Link>
                <Link color="foreground" href={"/authed/vehicles"} className="font-medium">Vehicles</Link>
            </NavbarItem>

            <NavbarItem>
                <Link color="foreground" href={"/authed/customers"} className="font-medium">Customers</Link>
            </NavbarItem>

        </NavbarContent>

        <NavbarContent justify="end">
            <NavbarItem>
                <Button  as={Link} variant="ghost" color="danger" href={"/logout"}>Log out</Button>
            </NavbarItem>
        </NavbarContent>
    </Navbar>
}