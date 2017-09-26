/*****************************************************************************/
/* Register: Event Handlers */
/*****************************************************************************/
Template.Register.events({
	'submit .register-form': function(event) {
		event.preventDefault();
		target = event.target
		var firstName = target.registerFirstName.value
		var lastName = target.registerLastName.value
		var email = target.registerEmail.value
		var password = target.registerPassword.value
		var accountType = target.registerAccountType.value
		
		if (Session.get("validPassword") && Session.get("validEmail") && firstName != "" && lastName != "" && accountType != "") {
			Accounts.createUser({
				first_name: firstName,
				last_name: lastName,
				email: email,
				password: password,
				accountType: accountType
			}, function(error) {
				if (error) {
					console.log(error.message)
					if (error.message == "Email already exists. [403]") {
						$("#registerEmail").removeClass("valid")
						$("#registerEmail").addClass("invalid")
						$("#registerEmail-label").attr("data-error", "Email already exists")
						Session.set("validEmail", false)
					}
				} else {
					console.log("successfully registered!")
					// reset all input fields
					target.registerFirstName.value = ""
					target.registerLastName.value = ""
					target.registerEmail.value = ""
					target.registerPassword.value = ""
					$('#register-modal').closeModal();
					Router.go('/profile');
				}
			});
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
			$("#registerPassword-label").attr("data-error", "Password must be at least 6 characters long")
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
			$("#registerEmail-label").attr("data-error", "Invalide Email (@mail.utoronto.ca required)")
			Session.set("validEmail", false)
		}
	},
	'click #cancel':function() {
		$('#register-modal').closeModal();
	}
});

/*****************************************************************************/
/* Register: Helpers */
/*****************************************************************************/
Template.Register.helpers({
});

/*****************************************************************************/
/* Register: Lifecycle Hooks */
/*****************************************************************************/
Template.Register.onCreated(function () {
});

Template.Register.onRendered(function () {
	// initialize material design select
	$(document).ready(function() {
		$('select').material_select();
	})
	Session.set("validEmail", false)
	Session.set("validPassword", false)
});

Template.Register.onDestroyed(function () {
});
