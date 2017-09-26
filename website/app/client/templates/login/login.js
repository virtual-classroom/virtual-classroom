/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
	'submit .login-form': function(event) {
		event.preventDefault();
		target = event.target
		var email = target.loginEmail.value
		var password = target.loginPassword.value
		if (email != "" && password != "") {
			Meteor.loginWithPassword(email, password, function(error) {
				// log error, otherwise dismiss modal
				if (error) {
					console.log(error)
					// display error code to user
					if (error.reason === "Incorrect password") {
						$("#loginPassword").removeClass("validate")
						$("#loginPassword").removeClass("valid")
						$("#loginPassword").addClass("invalid")
						$("#loginPassword-label").attr("data-error", error.reason)
					} else if (error.reason === "User not found") {
						$("#loginEmail").removeClass("validate")
						$("#loginEmail").removeClass("valid")
						$("#loginEmail").addClass("invalid")
						$("#loginEmail-label").attr("data-error", error.reason)
					}
				} else {
					// reset all input fields
					target.loginEmail.value = ""
					target.loginPassword.value = ""
					$('#login-modal').closeModal();
					Router.go('/profile');
				}
			});
		}
	},
	'click #cancel':function(event) {
		$('#login-modal').closeModal();
	}
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({
});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.onCreated(function () {
});

Template.Login.onRendered(function () {
});

Template.Login.onDestroyed(function () {
});
