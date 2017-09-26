Accounts.onCreateUser(function(options, user) {
	user.first_name = options.first_name
	user.last_name = options.last_name
	// Use provided profile in options, or create an empty object
	user.profile = options.profile || {}
	// Assigns first name, last name and account type to the newly created user object
	user.profile.first_name = options.first_name
	user.profile.last_name = options.last_name
	user.profile.accountType = options.accountType
	// Basic Role Setup
	user.roles = 'user'
	// Returns the user object
	return user
})