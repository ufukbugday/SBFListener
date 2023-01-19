export class AuthResponse {
    data: {
        userGroup: number,
        token: string
    }
    status: number
    error: any

    constructor(data: { userGroup: number; token: string }, status: number, error: any) {
        this.data = { userGroup: 0, token: '' };
        this.status = status
        this.error = error
    }
}