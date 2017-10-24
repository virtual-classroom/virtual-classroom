/*****************************************************************************/
/* Settings: Event Handlers */
/*****************************************************************************/
Template.Settings.events({
	'click #confirm-modal-trigger': function() {
		$('#edit-personal-modal').modal('open')
	},
	'click #cancel': function() {
		// reset all values back the what is on db when user click cancel
		var user = Meteor.user()
		var dbFirstName = user.profile.first_name
		var dbLastName = user.profile.last_name
		var dbEmail = user.emails[0].address
		$('#firstName').val(dbFirstName)
		$('#lastName').val(dbLastName)
		$('#email').val(dbEmail)
		// reset validate check for all fields
		$('#firstName').addClass('valid')
		$('#firstName').removeClass('invalid')
		Session.set("validFirstName", true)
		$('#lastName').addClass('valid')
		$('#lastName').removeClass('invalid')
		Session.set("validLastName", true)
		$('#email').addClass("valid")
		$("#email").removeClass("invalid")
		Session.set("validEmail", true)
		Router.go('/')
	},
	'keyup #firstName': function() {
		var input = $('#firstName').val()
		if (input != "") {
			$('#firstName').addClass('valid')
			$('#firstName').removeClass('invalid')
			Session.set("validFirstName", true)
		} else {
			$("#firstName").removeClass("valid")
			$("#firstName").addClass("invalid")
			$("#firstName-label").attr("data-error", "First Name cannot be empty")
			Session.set("validFirstName", false)
		}
	},
	'keyup #lastName': function() {
		var input = $('#lastName').val()
		if (input != "") {
			$('#lastName').addClass('valid')
			$('#lastName').removeClass('invalid')
			Session.set("validLastName", true)
		} else {
			$("#lastName").removeClass("valid")
			$("#lastName").addClass("invalid")
			$("#lastName-label").attr("data-error", "Last Name cannot be empty")
			Session.set("validLastName", false)
		}
	},
	'click #confirm-change':function() {
		var firstname = document.getElementById('firstName').value
		var lastname = document.getElementById('lastName').value
		if (firstname != "" && lastname != "" && Session.get('avatar')) {
			var userInfo = {}
			userInfo.firstname = firstname
			userInfo.lastname = lastname
			userInfo.avatar = Session.get('avatar')
			Meteor.call('updateUserInfo', Meteor.userId(), userInfo, function(error, result) {
				if (error) {
					console.log(error)
					Materialize.toast('Error: ' + error.message, 8000)
				} else {
					$('#edit-personal-modal').modal('close')
					Materialize.toast('Information updated', 4000)
					Router.go('/')
				}
			})
		}
	},
	'click #confirm-cancel': function() {
		$('#edit-personal-modal').modal('close')
	},
	'click .avatar-btn': function() {
		Session.set('avatar', this._id)
	}
});

/*****************************************************************************/
/* Settings: Helpers */
/*****************************************************************************/
Template.Settings.helpers({
	getAvatars: function() {
		return Avatars.find({})
	},
	getSelectedAvatar: function() {
		var avatar = Avatars.findOne(Session.get('avatar'))
		return avatar.url
	},
	isSelectedAvatar: function(avatarId) {
		if (avatarId == Session.get('avatar')) return 'selected'
	},
	updateSelectedAvatar: function(avatarId) {
		Session.set('avatar', avatarId)
	}
});

/*****************************************************************************/
/* Settings: Lifecycle Hooks */
/*****************************************************************************/
Template.Settings.onCreated(function () {
});

Template.Settings.onRendered(function () {
	Session.set('validFirstName', true)
	Session.set('validLastName', true)
	Session.set('validEmail', true)
	$('#edit-personal-modal').modal()
	var user = Meteor.user()
	var avatar = Avatars.findOne(user.profile.picture)
	if (avatar) Session.set('avatar', avatar._id)
});

Template.Settings.onDestroyed(function () {
});
