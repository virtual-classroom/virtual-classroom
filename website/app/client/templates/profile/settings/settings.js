/*****************************************************************************/
/* Settings: Event Handlers */
/*****************************************************************************/
Template.Settings.events({
	'click #confirm-trigger': function() {
		var firstName = document.getElementById('firstName').value; 
		var lastName = document.getElementById('lastName').value;
		// get the currently stored user details
		var user = Meteor.user()
		var dbFirstName = user.profile.first_name
		var dbLastName = user.profile.last_name
		// check if there is any changes compare to the value in db
		if (Session.get('validFirstName') && Session.get('validLastName') && Session.get('validEmail')) {
			if (dbFirstName != firstName || dbLastName != lastName) {
				$('#edit-personal-modal').openModal()
			}
		}
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
		Router.go('/profile')
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
		var firstName = document.getElementById('firstName').value; 
		var lastName = document.getElementById('lastName').value;
		Meteor.users.update(Meteor.userId(), {
			$set: {
				'profile.first_name':firstName,
				'profile.last_name':lastName
			}
		},function(error){
			if (error) {
				console.log(error)
			} else {
				$('#edit-personal-modal').closeModal()
				Materialize.toast('Personal information updated successfully', 4000)
				Router.go('/profile')
			}
		})
		
	},
	'click #confirm-cancel': function() {
		$('#edit-personal-modal').closeModal();
	}
});

/*****************************************************************************/
/* Settings: Helpers */
/*****************************************************************************/
Template.Settings.helpers({

});

/*****************************************************************************/
/* Settings: Lifecycle Hooks */
/*****************************************************************************/
Template.Settings.onCreated(function () {
});

Template.Settings.onRendered(function () {
	// initiate valid check for first name, last name and email
	Session.set('validFirstName', true)
	Session.set('validLastName', true)
	Session.set('validEmail', true)
});

Template.Settings.onDestroyed(function () {
});
