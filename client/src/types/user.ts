export type TUser = {
    id: string;
    name: string;
    email: string;
    roleRef: string;
    role: string;
    warehouseRef: string | null;
    warehouse: string | null;
};