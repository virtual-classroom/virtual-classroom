import Papa from 'papaparse';
/*****************************************************************************/
/* Course: Event Handlers */
/*****************************************************************************/
Template.Course.events({
    'click #create-lecture-trigger': function () {
        $('#create-lecture-modal').modal('open')
    },
    'click #cancel-create-lecture': function () {
        resetCreateLectureForm()
        $('#create-lecture-modal').modal('close')
    },
    'submit #create-lecture-form': function (event) {
        event.preventDefault()
        if (userIsCourseInstructor()) {
            var title = $('#lectureName').val()
            var user = Meteor.user()
            var course = Courses.findOne({code: Session.get('courseCode')})
            if (title == "") {
                $("#lectureName").removeClass("validate")
                $("#lectureName").removeClass("valid")
                $("#lectureName").addClass("invalid")
                $("#lectureName-label").attr("data-error", "Please give this lecture a title")
                Session.set("validLectureSection", false)
            } else if (Lectures.findOne({'lecture': title})) {
                $("#lectureName").removeClass("validate")
                $("#lectureName").removeClass("valid")
                $("#lectureName").addClass("invalid")
                $("#lectureName-label").attr("data-error", "This lecture already exists")
                Session.set("validLectureSection", false)
            } else {
                title = title.replace(/\?/g, '')
                Meteor.call('addLecture', title, course.code, function (error, result) {
                    if (error) {
                        console.log(error)
                        Materialize.toast('Error: ' + error.message, 8000)
                    } else {
                        resetCreateLectureForm()
                        $('#create-lecture-modal').modal('close')
                        Materialize.toast('Lecture ' + title + ' has been created!', 4000)
                    }
                })
            }
        }
    },
    'submit #course-settings-form': function (event) {
        event.preventDefault()
        if (userIsCourseOwner()) {
            var instructors = $('#selectCourseInstructors').val()
            if (!instructors) instructors = []
            settings = {}
            settings.instructors = instructors
            Meteor.call("updateCourseSettings", Session.get('courseCode'), settings,
                function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        Materialize.toast('Course settings updated', 4000)
                    }
                }
            )
        }
    },
    // 'change #group-csv': function(event) {
    // 	var course = Courses.findOne({code: Session.get('courseCode')})
    //    console.log(course);
    //    if (course && userIsCourseOwner()) {
    // 		Papa.parse(event.target.files[0], {
    // 			header: true,
    // 			complete: function(results, file) {
    // 				if (results.error) {
    // 					Materialize.toast('CSV Parse Error: ' + results.error)
    // 				} else if (results.meta.fields.indexOf('ID') < 0 ||
    // 					results.meta.fields.indexOf('Group') < 0) {
    // 					Materialize.toast('Incorrect CSV format')
    // 				} else if (results.data.length != course.students.length) {
    // 					Materialize.toast('The CSV file does not include all students in class')
    // 				} else {
    // 					Meteor.call('addDefaultGroups', Session.get('courseCode'),
    // 						results.data, function(error) {
    // 							if (error) console.log(error)
    // 							else  Materialize.toast('Groups added')
    // 						}
    // 					)
    // 				}
    // 			}
    // 		})
    // 	}
    // },
    'change #student-csv': function (event) {
        var course = Courses.findOne({code: Session.get('courseCode')})
        if (course && userIsCourseOwner()) {
            Papa.parse(event.target.files[0], {
                header: true,
                complete: function (results, file) {
                    if (results.error) {
                        Materialize.toast('CSV Parse Error: ' + results.error)
                    } else if (results.meta.fields.indexOf('StudentID') < 0 ||
                        results.meta.fields.indexOf('Group') < 0) {
                        Materialize.toast('Incorrect CSV format')
                    } else {
                        Meteor.call('addDefaultStudents', Session.get('courseCode'),
                            results.data, function (error) {
                                if (error) console.log(error)
                                else  Materialize.toast('New Students Enrolled')
                            }
                        )
                    }
                }
            })
        }
    }
});

/*****************************************************************************/
/* Course: Helpers */
/*****************************************************************************/
Template.Course.helpers({
    lectures: function () {
        var lectures = Lectures.find({courseCode: Session.get('courseCode')},
            {sort: {createdAt: 1}})
        if (lectures.count()) return lectures
    },
    course: function () {
        var course = Courses.findOne({
            'code': Session.get('courseCode'),
            'status': 'active'
        })
        if (course) return course
    },
    userIsCourseInstructorSelect: function (userId) {
        if (userIsCourseInstructor(userId)) return 'selected'
    },
    userIsCourseOwnerSelect: function (userId) {
        if (userIsCourseOwner(userId)) return 'disabled'
    },
    groups: function () {
        var groups = Groups.find()
        if (groups.fetch().length > 0) return groups
    }
});

function userIsCourseInstructor(userId) {
    var course = Courses.findOne({code: Session.get('courseCode')})
    if (course) {
        if (userId) return course.instructors.indexOf(userId) >= 0
        else return course.instructors.indexOf(Meteor.userId()) >= 0
    }
}

function userIsCourseOwner(userId) {
    var course = Courses.findOne({code: Session.get('courseCode')})
    if (course) {
        if (userId) return course.ownerId == userId
        else return course.ownerId == Meteor.userId()
    }
}

function resetCreateLectureForm() {
    $('#lectureName').val('')
    $('#lectureName').addClass('valid')
    $('#lectureName').removeClass("invalid")
    $('#lectureName-label').removeClass('active')
}

/*****************************************************************************/
/* Course: Lifecycle Hooks */
/*****************************************************************************/
Template.Course.onCreated(function () {
});

Template.Course.onRendered(function () {
    Meteor.setTimeout(function () {
        $('#create-lecture-modal').modal()
        $('#selectCourseInstructors').material_select()
    }, 50)
    Session.set("validLectureSection", false)
    var courseCode = Router.current().params.code
    if (courseCode) Session.set('courseCode', courseCode.toUpperCase())
    $('#class-size-tooltip').tooltip({delay: 50})
});

Template.Course.onDestroyed(function () {
});
