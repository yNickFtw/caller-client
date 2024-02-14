import { IApiResponse } from "@/shared/interfaces/IApiResponse";
import AppError from "@/shared/helpers/AppError";
import { api } from "@/api";

export default class MemberService extends AppError {
    private appError: AppError

    constructor(){
        super()
        this.appError = new AppError();
    }

    public async joinServer(token: string, serverId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/members/add/to/server`, { serverId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllMembersByServerId(token: string, serverId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/members/find/all/${serverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async leaveServer(token: string, serverId: string): Promise<IApiResponse> {
        try {
            const response = await api.delete(`/members/leave/server/${serverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllServersWhereUserIsOwner(token: string): Promise<IApiResponse> {
        try {
            const response = await api.get("/members/find/all/where/owner", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}