import AppError from "@/shared/helpers/AppError";
import { IApiResponse } from "@/shared/interfaces/IApiResponse";
import { api } from "@/api";

export default class MessageService extends AppError {
    private appError: AppError;

    constructor() {
        super()
        this.appError = new AppError()
    }

    public async create(formData: FormData, token: string, channelId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/messages/send/message/${channelId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllMessageByChannelId(token: string, channelId: string, serverId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/messages/find/all/channel/${channelId}/${serverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async newMessageOnServer(token: string, channelId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/new_messages_servers/send/message/${channelId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllNewMessagesServer(token: string, serverId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/new_messages_servers/find/all/${serverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error) {
            return this.appError.handleErrorResponse(error);
        }
    }

}