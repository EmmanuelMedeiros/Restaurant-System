import { registerAs } from "@nestjs/config"

export default registerAs('jwt', () => {
    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUE,
        jwtLifeTime: Number(process.env.JWT_LIFE_TIME ?? 3600),
        refreshJwtLifeTime: Number(process.env.REFRESH_JWT_LIFE_TIME ?? 172800)
    }
})