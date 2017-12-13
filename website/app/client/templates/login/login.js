/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
	'submit .login-form': function(event) {
		event.preventDefault()
		var email = $('#loginEmail').val()
		var password = $('#loginPassword').val()
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
					resetInput()
					$('#login-modal').modal('close')
				}
			});
		}
	},
	'click #login-cancel':function(event) {
		resetInput()
		$('#login-modal').modal('close')
	}
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({
});

function resetInput() {
	$('#loginEmail').val('')
	$("#loginEmail").addClass("valid")
	$("#loginEmail").removeClass("invalid")
	$("#loginEmail-label").removeClass('active')
	$('#loginPassword').val('')
	$('#loginPassword').addClass('valid')
	$('#loginPassword').removeClass('invalid')
	$('#loginPassword-label').removeClass("active")
}

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.onCreated(function () {
});

Template.Login.onRendered(function () {
});

Template.Login.onDestroyed(function () {
});
