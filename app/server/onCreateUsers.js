Accounts.onCreateUser(function(options, user) {
	if (options.accountType == 'student') {
		user._id = options._id
	} else if (options.accountType == 'instructor') {
		user._id = Random.id()
	}
	user.first_name = options.first_name
	user.last_name = options.last_name
	// Use provided profile in options, or create an empty object
	user.profile = options.profile || {}
	// Assigns first name, last name and account type to the newly created user object
	user.profile.first_name = options.first_name
	user.profile.last_name = options.last_name
	user.profile.accountType = options.accountType
	// randomly assign avatar to user
	var avatars = Avatars.find().fetch()
	var avatar = avatars[Math.floor(Math.random() * avatars.length)]
	user.profile.picture = avatar._id
	// Basic Role Setup
	user.roles = 'user'
	// Returns the user object
	return user
})


Meteor.publish('Users', function () {
	var user = Meteor.user()
	if (user) {
		if (user.profile.accountType === 'instructor') {
			return Meteor.users.find({}, {
				fields: {
					'profile': 1
				}
			})
		} else {
			return Meteor.users.find({}, {
				fields: {
					'profile.first_name': 1,
					'profile.last_name': 1,
					'profile.picture': 1
				}
			})
		}
	}
})