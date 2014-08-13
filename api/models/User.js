module.exports = {
	attributes: {
        first_name: {
            type: 'string',
            required: true
        },
        last_name: {
            type: 'string',
            required: true
        },
		username: {
			type: 'string',
			required: true,
			unique: true
		},
		email: {
			type: 'email',
			required: true,
			unique: true
		},
        role: {
            type: 'string',
            enum: ['subject', 'coordinator', 'admin'],
            required: true
        },
		passports: {
            collection: 'Passport',
            via: 'user'
        }
	}
};
