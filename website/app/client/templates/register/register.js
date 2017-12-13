/*****************************************************************************/
/* Register: Event Handlers */
/*****************************************************************************/
Template.Register.events({
	'submit .register-form': function(event) {
		event.preventDefault()
		var firstName = $('#registerFirstName').val()
		var lastName = $('#registerLastName').val()
		var email = $('#registerEmail').val()
		var password = $('#registerPassword').val()
		var accountType = $('#registerAccountType').val()
		var utorid = $('#registerUTORID').val()
		
		if (accountType == 'instructor') Session.set('validUTORID', true)

		if (Session.get("validPassword") && Session.get("validEmail") && 
			Session.get("validUTORID") && firstName != "" && lastName != "" 
			&& accountType != "") {
			options = {
				_id: utorid,
				first_name: firstName,
				last_name: lastName,
				email: email,
				password: password,
				accountType: accountType
			}
			Accounts.createUser(options, function(error) {
				if (error) {
					console.log(error)
					if (error.error == 403) {
						$("#registerEmail").removeClass("valid")
						$("#registerEmail").addClass("invalid")
						$("#registerEmail-label").attr("data-error", 
							"Email already exists")
						Session.set("validEmail", false)
					} else if (error.error == 500) {
						$("#registerUTORID").removeClass("valid")
						$("#registerUTORID").addClass("invalid")
						$("#registerUTORID-label").attr("data-error", 
							"Account with this UTORID has already been registered")
					}
				} else {
					resetInput()
					$('#register-modal').modal('close')
				}
			});
		} else {
			Materialize.toast('Please check your information', 4000)
		}
	},
	'keyup #registerPassword': function() {
		// check if username already taken or invalid format
		var input = $('#registerPassword').val()

		if (input.length >= 6) {
			$('#registerPassword').addClass("valid")
			$("#registerPassword").removeClass("invalid")
			Session.set("validPassword", true)
		} else {
			$("#registerPassword").removeClass("valid")
			$("#registerPassword").addClass("invalid")
			$("#registerPassword-label").attr("data-error", 
				"Password must be at least 6 characters long")
			Session.set("validPassword", false)
		}
	},
	'keyup #registerEmail': function() {
		// check if email is valid or already exist
		var input = $('#registerEmail').val()
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(mail.utoronto.ca)$/;
		if (regex.test(input)) {
			$('#registerEmail').addClass("valid")
			$("#registerEmail").removeClass("invalid")
			Session.set("validEmail", true)
		} else {
			$("#registerEmail").removeClass("valid")
			$("#registerEmail").addClass("invalid")
			$("#registerEmail-label").attr("data-error", 
				"Invalid Email (@mail.utoronto.ca required)")
			Session.set("validEmail", false)
		}
	},
	'keyup #registerUTORID': function() {
		var input = $('#registerUTORID').val()
		if (input.length == 10) {
			$('#registerUTORID').addClass("valid")
			$("#registerUTORID").removeClass("invalid")
			Session.set("validUTORID", true)
		} else {
			$("#registerUTORID").removeClass("valid")
			$("#registerUTORID").addClass("invalid")
			$("#registerUTORID-label").attr("data-error", "Invalid UTORID")
			Session.set("validUTORID", false)
		}
	},
	'change #registerAccountType': function() {
		if ($('#registerAccountType').val() == 'student') {
			Session.set('studentAccount', true)
		} else {
			Session.set('studentAccount', false)
		}
	},
	'click #register-cancel': function() {
		resetInput()
		$('#register-modal').modal('close')
	}
});

/*****************************************************************************/
/* Register: Helpers */
/*****************************************************************************/
Template.Register.helpers({
	'showUTORIDField': function() {
		return Session.get('studentAccount')
	}
});

function resetInput() {
	$('#registerFirstName').val('')
	$("#registerFirstName-label").removeClass("active")
	$('#registerLastName').val('')
	$("#registerLastName-label").removeClass("active")
	$('#registerEmail').val('')
	$('#registerEmail').addClass("valid")
	$("#registerEmail").removeClass("invalid")
	$("#registerEmail-label").removeClass("active")
	$('#registerPassword').val('')
	$('#registerPassword').addClass("valid")
	$("#registerPassword-label").removeClass("active")
	$("#registerEmail-label").removeClass("active")
	$('#registerAccountType').val('')
	$('#registerUTORID').val('')
	$("#registerUTORID").addClass("valid")
	$("#registerUTORID").removeClass("invalid")
	$("#registerUTORID-label").removeClass("active")
}

/*****************************************************************************/
/* Register: Lifecycle Hooks */
/*****************************************************************************/
Template.Register.onCreated(function () {
});

Template.Register.onRendered(function () {
	// initialize material design select
	$(document).ready(function() {
		$('select').material_select()
	})
	Session.set("validEmail", false)
	Session.set("validPassword", false)
	Session.set("validUTORID", false)
	Session.set('studentAccount', false)
});

Template.Register.onDestroyed(function () {
});
