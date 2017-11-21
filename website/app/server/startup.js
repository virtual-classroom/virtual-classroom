// add these users with these emails address as admin
var admin = ['mybryan.li@mail.utoronto.ca'];
_.map(admin, function(email) {
	var user = Accounts.findUserByEmail(email)
	if(user) {
		if (user.roles != 'admin') {
			Meteor.users.update({_id:user._id}, {$set: {roles:'admin'}})
		}
	}
})

// initialize Avatars collections
var avatars = ['1F602.svg', '1F606.svg', '1F610.svg', '1F611.svg', '1F626.svg', '1F634.svg', '1F642.svg', '1F913.svg']
_.map(avatars, function(avatarName) {
	var avatar = Avatars.findOne({name: avatarName})
	if (!avatar) {
		Avatars.insert({
			name: avatarName,
			url : '/avatars/' + avatarName
		}, function(error) {
			if (error) console.log(error)
		})
	}
})

// update lectures with mode, displayQuestions and groupSize
var lectures = Lectures.find().fetch()
_.map(lectures, function(lecture) {
	if (!lecture.groupSize) {
		Lectures.update(lecture._id, {$set: {
			mode: "lecture",
			displayQuestion: "",
			groupSize: 2
		}})		
	}
})

// create test users
var number = 50
var utorid = 1000000000
for (i = 1; i <= number; i++) {
	if (i < 10) var last = "0" + i
	else var last = i.toString()

	var existing = Meteor.users.findOne({
		'profile.first_name':"Tester",
		'profile.last_name':last
	})

	if (!existing) {
		options = {
			_id: (utorid + i).toString(),
			first_name: "Tester",
			last_name: last,
			email: "tester" + last + "@mail.utoronto.ca",
			password: "tester" + last,
			accountType: 'student'
		}
		Accounts.createUser(options)
	}
}

// create test instructor
for (i = 1; i < 4; i ++) {
	var last = "0" + i
	var existing = Meteor.users.findOne({
		'profile.first_name': 'Instructor',
		'profile.last_name': last
	})
	if (!existing) {
		options = {
			first_name: 'Instructor',
			last_name: last,
			email: 'instructor' + last + "@mail.utoronto.ca",
			password: 'instructor' + last,
			accountType: 'instructor'
		}
		Accounts.createUser(options)
	}
}

// add test users to CSC108H
var course = Courses.findOne({code:'CSC108H'})
if (course) {
	var users = Meteor.users.find({'profile.accountType':'student'}).fetch()
	_.map(users, function(user) {
		if (course.students.indexOf(user._id) < 0) {
			var temp = course.students
			temp.push(user._id)
			Courses.update(course._id, {
				$set: {students: temp}
			},function(error) {
				if (error) throw new Meteor.Error("Update error", error.message, error.message)
			})
		}
	})
}



// initialize SEO for each page
SeoCollection.update(
	{
		route_name:"home"
	}, {
		$set: {
			route_name : "home",
			title : "Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			},
			og: {
				"title":"Virtual Class",
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment",
				"type":"website",
				"url":"http://rtmp.bryanli.xyz",
				"site_name":"Virtual Class",
				"image":"icons/cardboard.png",
				"image:type":"image/png",
				"image:width":"1000",
				"image:height":"1000",
				"locale":"en_US"
			}
		}
	}, {
		upsert:true
	}
);

SeoCollection.update(
	{
		route_name:"createNewCourse"
	}, {
		$set: {
			route_name : "createNewCourse",
			title : "Create Course | Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			}
		}
	}, {
		upsert:true
	}
);

SeoCollection.update(
	{
		route_name:"settings"
	}, {
		$set: {
			route_name : "settings",
			title : "Settings | Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			}
		}
	}, {
		upsert:true
	}
);

SeoCollection.update(
	{
		route_name:"coursesList"
	}, {
		$set: {
			route_name : "coursesList",
			title : "Courses | Virtual Class",
			meta: {
				"description": "Utilize affordable 360 cameras and VR headset like Google Cardboard to create a virtual environment"
			}
		}
	}, {
		upsert:true
	}
);