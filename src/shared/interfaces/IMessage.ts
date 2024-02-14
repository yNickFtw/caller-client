import { IUser } from "@/states/useUserStore";

export interface IMessage {
    id: string;
    text: string;
    image: string;
    imageFilename: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    channelId: string;
    user: IUser;
}