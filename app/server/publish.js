// Meteor.publish('usersEmail', function() {
// 	return Meteor.users.find({}, {fields: {'emails': 1}});
// });
// Meteor.publish('userData', function () {
// 	var user = Meteor.user()
// 	if (user) {
// 		if (user.profile.accountType === 'instructor') {
// 			return Meteor.users.find({}, {
// 				fields: {
// 					'profile': 1
// 				}
// 			})
// 		} else {
// 			return Meteor.users.find({}, {
// 				fields: {
// 					'profile.first_name': 1,
// 					'profile.last_name': 1,
// 					'profile.picture': 1
// 				}
// 			})
// 		}
// 	}
// })