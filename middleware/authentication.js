const {
	NotFoundError,
	BadRequestError,
	UnauthenticatedError,
	UnauthorizedError,
} = require("../errors");
const { isTokenValid } = require("../utils");

const authMiddleware = (req, res, next) => {
	const token = req.signedCookies.token;
	if (!token) {
		throw new UnauthenticatedError("Unauthenticated");
	}
	try {
		const { name, userId, role } = isTokenValid({ token });
		req.user = { name, userId, role };
		next();
	} catch (error) {
		throw new UnauthenticatedError("Unauthenticated");
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new UnauthorizedError(
				"user not authrorized to access this resource"
			);
		}
		next();
	};
};

module.exports = { authMiddleware, authorizePermissions };
