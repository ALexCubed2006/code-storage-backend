// middleware to validate data
// like email and password
export const validateMiddleware = async (req, res, next) => {
    const { name = null, email, password } = req.body
    if( !email || !password) {
        return res.json({ error: '[validator] Email and password are required' })
    }

    next()
}