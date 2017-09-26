/*****************************************************************************/
/* Course: Event Handlers */
/*****************************************************************************/
Template.Course.events({
	'click #create-lecture-trigger': function() {
		$('#create-lecture-modal').openModal()
	},
	'click #cancel-create-lecture': function() {
		//Reset form
		$('#lectureName').val('')
		$('#lectureName').removeClass("invalid")
		$('#create-lecture-modal').closeModal()
	},
	'submit .create-lecture-form': function(event) {
		event.preventDefault();
		target = event.target
		var title = target.lectureName.value
		if (title == "") {
			$("#lectureName").removeClass("validate")
			$("#lectureName").removeClass("valid")
			$("#lectureName").addClass("invalid")
			$("#lectureName-label").attr("data-error", "Please give this lecture a title")
			Session.set("validLectureSection", false)
		} else if (Lectures.findOne({'lecture':title})) {
			$("#lectureName").removeClass("validate")
			$("#lectureName").removeClass("valid")
			$("#lectureName").addClass("invalid")
			$("#lectureName-label").attr("data-error", "This lecture already exists")
			Session.set("validLectureSection", false)
		} else {
			// get course
			var url = Router.current().params.code.toUpperCase();
			const course = Courses.findOne({ 'code' : url});

			// generate lecture id
			id = Random.id()
			//Create Lecture
			Lectures.insert({
				_id: id,
				createdAt: new Date(),
				courseTitle: course.title,
				courseCode: course.code,
				lectureTitle: title,
				files: [],
				threshold: 5,
				onlineStudents:[],
				status: 'inactive'
			}, function(error) {
				if (error) {
					console.log(error)
				} else {
					//Reset form
					$('#lectureName').val('')
					$('#lectureName').removeClass("invalid")
					$('#create-lecture-modal').closeModal()
					Materialize.toast('Lecture ' + title + ' has been created!', 4000)
				}
			})
			//Add Lecture to Course
			var updatedLectures = course.lectures
			updatedLectures.push(id)
			Courses.update(course._id, {
				$set: {lectures: updatedLectures}
			})
		}
	}
});

/*****************************************************************************/
/* Course: Helpers */
/*****************************************************************************/
Template.Course.helpers({
	lectureAvailable: function() {
		// return if there is any lecture created under this course
		var lectures = Lectures.find({courseCode: course.code})
		return lectures.count() > 0
	},
	course: function() {
		//return course
		var courseCode = Router.current().params.code
		if (courseCode) {
			courseCode = courseCode.toUpperCase()
			var course = Courses.find({
				'code': courseCode,
				'status': 'active'
			})
			if (course.count()) {
				return course
			}
		}
	},
	get_lecture: function(lecture_id) {
		var this_lecture = Lectures.findOne({_id: lecture_id});
		return this_lecture;
	}
});

/*****************************************************************************/
/* Course: Lifecycle Hooks */
/*****************************************************************************/
Template.Course.onCreated(function () {
});

Template.Course.onRendered(function () {
	Session.set("validLectureSection", false)
	// initialize tooltip
	$('#class-size-tooltip').tooltip({delay: 50})
});

Template.Course.onDestroyed(function () {
});
