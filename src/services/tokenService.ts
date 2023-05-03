import jwt from 'jsonwebtoken'

export const tokenService = {
    generateToken(id: string) {
        return jwt.sign(
            {
                _id: id
            },
            process.env.JWT_ACCESS_SECRET!,
            {
                expiresIn: '30d'
            })
    }
}