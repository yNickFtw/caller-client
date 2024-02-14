import { IUser } from "@/states/useUserStore";

export interface IMember {
    id: string;
    userId: string;
    serverId: string;
    isOwner: boolean;
    user: IUser;
}