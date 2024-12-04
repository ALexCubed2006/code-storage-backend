// middleware to validate data
// like email and password
export const validateMiddleware = async (req, res, next) => {
	const { name = null, email, password } = req.body
	if (!email || !password) {
		return res.json({
			error: '[validator] Email and password are required',
		})
	}

	if (name) {
		if (name.length < 3) {
			return res.json({
				error: '[validator] Name must be at least 3 characters',
			})
		}
	}

	if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
		return res.json({
			error: '[validator] Invalid email',
		})
	}

	if (password.length < 8) {
		return res.json({
			error: '[validator] Password must be at least 8 characters',
		})
	}

	if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
		return res.json({
			error: '[validator] Password must contain at least one letter and one number',
		})
	}

	next()
}
