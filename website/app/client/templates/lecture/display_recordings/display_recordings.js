/*****************************************************************************/
/* DisplayRecordings: Event Handlers */
/*****************************************************************************/
Template.DisplayRecordings.events({
	'click .play-button': function() {
		var player = document.getElementById(this.question)
		var button = document.getElementById(this.question + '-button')
		if (player.paused) {
			player.play()
			// button.classList.add("active-blink")
		} else {
			player.pause()
			// button.classList.remove("active-blink")
		}
	}
});

/*****************************************************************************/
/* DisplayRecordings: Helpers */
/*****************************************************************************/
Template.DisplayRecordings.helpers({
	question: function() {
		return Questions.findOne(this.question)
	},
	getPercentage: function(value) {
		return value.toFixed(2) * 100 + "%"
	}
});

/*****************************************************************************/
/* DisplayRecordings: Lifecycle Hooks */
/*****************************************************************************/
Template.DisplayRecordings.onCreated(function () {
});

Template.DisplayRecordings.onRendered(function () {
	var courseCode = Router.current().params.code
	var title = Router.current().params.lecture
	var lecture = Lectures.findOne({$and: [{title: title}, {courseCode:courseCode}]})
	Session.set('lectureId', lecture._id)
});

Template.DisplayRecordings.onDestroyed(function () {
});
