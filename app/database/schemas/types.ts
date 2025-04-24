export type Customer = {
    customer_id: number;
    firstname: string;
    lastname: string;
    phone: string;
};

export type Vehicle = {
    VIN: string;
    customer_id: number;
    make: string;
    model: string;
    year: number;
};

export type Shop = {
    shop_id: number;
    address: string;
    phone: string;
    shop_name: string;
};

export type Mechanic = {
    employee_id: number;
    shop_id: number;
    firstname: string;
    lastname: string;
    phone: string;
    specialty: string;
};

export type Appointment = {
    appt_id: number;
    VIN: string;
    mechanic_id: number;
    shop_id: number;
    scheduled_datetime: string; // ISO format datetime
    status: string;
};

export type ServicePerformed = {
    service_id: number;
    appt_id: number;
    service_type: string;
    description: string;
    labor_hours: number;
};

export type Manufacturer = {
    man_id: number;
    man_name: string;
    address: string;
    phone: string;
    website: string;
};

export type Part = {
    part_num: number;
    service_id: number;
    part_name: string;
    quantity: number;
    cost: number;
};

export type PartManufacturer = {
    part_num: number;
    manufacturer_id: number;
};