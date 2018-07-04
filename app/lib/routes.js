Router.configure({
	layoutTemplate: 'MasterLayout',
	loadingTemplate: 'Loading',
	notFoundTemplate: 'NotFound',
	trackPageView: true
});

Router.route('/', {
	name: 'home',
	controller: 'HomeController',
	where: 'client'
});

Router.route('create_new_course', {
	name: 'createNewCourse',
	controller: 'CreateNewCourseController',
	where: 'client'
});

Router.route('course/:code', {
	name: 'course',
	controller: 'CourseController',
	where: 'client'
});

Router.route('course/:code/:lecture', {
	name: 'lecture',
	controller: 'LectureController',
	where: 'client'
});

Router.route('settings', {
	name: 'settings',
	controller: 'SettingsController',
	where: 'client'
});

Router.route('course/:code/:lecture/stream', {
  	name: 'stream',
    controller: 'StreamController',
	where: 'client'
});
