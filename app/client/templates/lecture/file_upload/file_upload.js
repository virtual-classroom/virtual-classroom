/*****************************************************************************/
/* FileUpload: Event Handlers */
/*****************************************************************************/
Template.FileUpload.events({
	'click #confirm-cancel':function() {
		$('#lecture-file-upload-modal').modal('close')
	},
	'change .add-file-form': function(event) {
		$('#fileName').removeClass("invalid")
		$('#fileName').addClass("validate")
		$("#fileName-label").attr("data-error", "Please select a file first")
		FS.Utility.eachFile(event, function(file) {
			Files.insert(file, function(error, fileObject) {
				if (error) {
					console.log(error)
					$('#file-path-input').removeClass("validate")
					$('#file-path-input').addClass("invalid")
				} else {
					// get file's default name
					var filename = $('#file-path-input').val()
					// set filename input field to filename
					$('#fileName').val(filename)
					// set input field active
					$('#fileName-label').addClass("active")
					// add file owner and lecture ID associate to this file
					Files.update({
						_id: fileObject._id
					}, {
						$set: {
							temp:true,
							owner: Meteor.userId(),
							lecture: lecture._id,
							filename: filename
						}
					})
				}
			})
		})
	},
	'submit .add-file-form': function(event) {
		event.preventDefault()
		var fileName = event.target.fileName.value
		if (fileName) {
			// get uploaded file
			var fileID = Files.find({temp:true, owner:Meteor.userId(), lecture:lecture._id}).fetch()[0]._id
			if (fileID) {
				Files.update({
					_id: fileID
				}, {
					$set: {
						filename: fileName,
						temp:false
					}
				}, function(error) {
					if (error) {
						console.log(error)
					}
				})
				//empty fileName field & upload field
				$('#fileName').val("")
				$('#file-path-input').val('')
				$('#lecture-file-upload-modal').modal('close')
			}
		} else {
			$('#fileName').removeClass("validate")
			$('#fileName').removeClass("valid")
			$('#fileName').addClass("invalid")
			$("#fileName-label").attr("data-error", "Please select a file first")
		}
	}
});

/*****************************************************************************/
/* FileUpload: Helpers */
/*****************************************************************************/
Template.FileUpload.helpers({
});

/*****************************************************************************/
/* FileUpload: Lifecycle Hooks */
/*****************************************************************************/
Template.FileUpload.onCreated(function () {
});

Template.FileUpload.onRendered(function () {
});

Template.FileUpload.onDestroyed(function () {
});
