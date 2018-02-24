// files = new FS.Store.GridFS('files');
// Files = new FS.Collection('files', {
//   	stores: [files],
// 	filter: {
// 		maxSize: 10485760,
// 		onInvalid: function (message) {
// 			console.log("File Collection Error: " + message);
// 		}
// 	}
// });

// Attachments = new FilesCollection({
// 	debug: false,
// 	storagePath: '/virtual-classroom/attachments',
// 	permissions: 0774,
// 	parentDirPermissions: 0774,
// 	collectionName: 'Attachments',
// 	allowClientCode: false,
// 	OnBeforeUpload: function(file) {
// 		if (Meteor.user()) {
// 			if (file.size <= 100*1024*1024) {
// 				// limit attachment files size to 100MB
// 				return true
// 			} else {
// 				return "Please upload attachment files that is no larger than 100MB"
// 			}
// 		}
// 	}
// });

// var attachmentsSchema = new SimpleSchema({
// 	createdAt: {
// 		type: Date,
// 		label: 'Uploaded time',
// 		defaultValue: new Date()
// 	},
// 	size: {
// 		type: Number
// 	},
// 	name: {
// 		type: String
// 	},
// 	type: {
// 		type: String
// 	},
// 	path: {
// 		type: String
// 	},
// 	isVideo: {
// 		type: Boolean
// 	},
// 	isAudio: {
// 		type: Boolean
// 	},
// 	isImage: {
// 		type: Boolean
// 	},
// 	isText: {
// 		type: Boolean
// 	},
// 	isJSON: {
// 		type: Boolean
// 	},
// 	isPDF: {
// 		type: Boolean
// 	},
// 	extension: {
// 		type: String,
// 		optional: true
// 	},
// 	_storagePath: {
// 		type: String
// 	},
// 	_downloadRoute: {
// 		type: String
// 	},
// 	_collectionName: {
// 		type: String
// 	},
// 	public: {
// 		type: Boolean,
// 		optional: true
// 	},
// 	meta: {
// 		type: Object,
// 		blackbox: true,
// 		optional: true
// 	},
// 	userId: {
// 		type: String,
// 		optional: true
// 	},
// 	updatedAt: {
// 		type: Date,
// 		optional: true
// 	},
// 	versions: {
// 		type: Object,
// 		blackbox: true
// 	}
// });

// Attachments.collection.attachSchema(attachmentsSchema)

// if (Meteor.isClient) {
// }

// if (Meteor.isServer) {
// 	Meteor.publish('attachmentsData', function(courseId, lectureId) {
// 		if (lectureId) {
// 			return Attachments.collection.find({meta: {lectureId: lectureId}})
// 		} else if (courseId) {
// 			return Attachments.collection.find({meta: {courseId: courseId}})
// 		} else {
// 			return Attachments.collection.find()
// 		}
// 	})
// 	Attachments.deny({
// 		update() { return true },
// 		remove() { return true }
// 	})
// }