import { Role } from "../../../domain/enums";

export interface JwtPayload {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: Role;
}