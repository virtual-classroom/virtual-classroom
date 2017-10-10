Questions = new FilesCollection({
	debug: false,
	storagePath: '/vr/audios',
	permissions: 0774,
	parentDirPermissions: 0774,
	collectionName: 'Questions',
	allowClientCode: false,
	OnBeforeUpload: function(file) {
		if (Meteor.user()) {
			if (file.size <= 100*1024*1024) {
				// limit attachment files size to 100MB
				return true
			} else {
				return "Please upload attachment files that is no larger than 100MB"
			}
		}
	}
});

var QuestionsSchema = new SimpleSchema({
	createdAt: {
		type: Date,
		label: 'Uploaded time',
		defaultValue: new Date()
	},
	size: {
		type: Number
	},
	name: {
		type: String
	},
	type: {
		type: String
	},
	path: {
		type: String
	},
	isVideo: {
		type: Boolean
	},
	isAudio: {
		type: Boolean
	},
	isImage: {
		type: Boolean
	},
	isText: {
		type: Boolean
	},
	isJSON: {
		type: Boolean
	},
	isPDF: {
		type: Boolean
	},
	extension: {
		type: String,
		optional: true
	},
	_storagePath: {
		type: String
	},
	_downloadRoute: {
		type: String
	},
	_collectionName: {
		type: String
	},
	public: {
		type: Boolean,
		optional: true
	},
	meta: {
		type: Object,
		blackbox: true,
		optional: true
	},
	userId: {
		type: String,
		optional: true
	},
	updatedAt: {
		type: Date,
		optional: true
	},
	versions: {
		type: Object,
		blackbox: true
	}
});

Questions.collection.attachSchema(QuestionsSchema)

if (Meteor.isClient) {
}

if (Meteor.isServer) {
	Meteor.publish('Questions', function(lectureId) {
		if (lectureId) {
			return Questions.collection.find({"meta.lectureId": lectureId})
		} else {
			return Audios.collection.find()
		}
	})
	Questions.deny({
		update() { return true },
		remove() { return true }
	})
}