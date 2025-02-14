export class RefreshTokenDTO {
    public readonly refreshToken: string;
    
    constructor(refreshToken: string) {
        this.refreshToken = refreshToken
    }
}