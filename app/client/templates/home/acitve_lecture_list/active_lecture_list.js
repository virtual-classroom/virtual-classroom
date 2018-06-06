/*****************************************************************************/
/* ActiveLectureList: Event Handlers */
/*****************************************************************************/
Template.ActiveLectureList.events({
});

/*****************************************************************************/
/* ActiveLectureList: Helpers */
/*****************************************************************************/
Template.ActiveLectureList.helpers({
	lectures: function() {
		var lectures = Lectures.find({active: true}, {sort: {courseCode:1}})
		if (lectures.count()) return lectures
	}
});

/*****************************************************************************/
/* AcitveLectureList: Lifecycle Hooks */
/*****************************************************************************/
Template.ActiveLectureList.onCreated(function () {
});

Template.ActiveLectureList.onRendered(function () {
});

Template.ActiveLectureList.onDestroyed(function () {
});
