files = new FS.Store.GridFS('files');
Files = new FS.Collection('files', {
  	stores: [files],
	filter: {
		maxSize: 10485760,
		onInvalid: function (message) {
			console.log("File Collection Error: " + message);
		}
	}
});