/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
    'server/method_name': function () {
        // server method logic
    },
    'addCourse': function (courseInfo, result) {
        let user = Meteor.user()
        let enrolledStudents = []
        if(result != null){
            for (let i = 0; i < result.length; i++) {
                let entry = result[i]
                if (entry.hasOwnProperty('StudentID')) {
                    enrolledStudents.push(entry['StudentID'])
                }
            }
        }
        if (user && user.profile.accountType == 'instructor') {
            var error = false
            return Courses.insert({
                ownerId: user._id,
                instructors: [user._id],
                title: courseInfo.title,
                code: courseInfo.code,
                status: "active",
                lectures: [],
                description: courseInfo.description,
                students: enrolledStudents,
                createdAt: new Date()
            }, function (error, data) {
                if (error) throw new Meteor.Error("Update error", error.message,
                    error.message)
                else {
                    if (result != null) {
                        // add all group in groups to Groups collection
                        let groups = {}
                        for (let i = 0; i < result.length; i++) {
                            let entry = result[i]
                            if (entry.hasOwnProperty('StudentID') && entry.hasOwnProperty('Group')) {
                                let student = Meteor.users.findOne(entry['StudentID'])
                                let groupNumber = entry['Group']
                                if (student && groupNumber) {
                                    temp = []
                                    if (groups.hasOwnProperty(groupNumber))
                                        temp = groups[groupNumber]
                                    if (temp.indexOf(student._id) < 0)
                                        temp.push(student._id)
                                    groups[groupNumber] = temp
                                }
                            }
                        }
                        for (var name in groups) {
                            if (groups.hasOwnProperty(name)) {
                                var members = groups[name]
                                var leader = members[Math.floor(Math.random() * members.length)]
                                Groups.insert({
                                    courseId: data,
                                    creator: user._id,
                                    leader: leader,
                                    name: name,
                                    members: members,
                                    active: false,
                                    default: true,
                                    createdAt: new Date()
                                }, function (error) {
                                    if (error) throw new Meteor.Error("Insert Group Error",
                                        error.message, error.message)
                                })
                            }
                        }
                    }
                }
            });
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied");
    },
    'updateCourseSettings': function (courseCode, settings) {
        var user = Meteor.user()
        var course = Courses.findOne({code: courseCode})
        if (user && course && course.ownerId == user._id) {
            instructors = settings.instructors
            // add owner back to instructor list
            instructors.splice(0, 0, course.ownerId)

            Courses.update(course._id, {
                $set: {
                    instructors: instructors
                }
            }, function (error) {
                if (error) throw new Meteor.Error("Update Error", error.message,
                    error.message)
            })
        } else {
            throw new Meteor.Error("Insert Error", "Access denied",
                "Access denied")
        }
    },
    'addLecture': function (lectureTitle, courseCode) {
        var user = Meteor.user()
        var course = Courses.findOne({code: courseCode})
        if (user && course && course.instructors.indexOf(user._id) >= 0) {
            // get group size if default group exist
            var defaultGroups = Groups.find({
                courseId: course._id,
                default: true
            }).fetch()
            var groupSize = 2
            if (defaultGroups.length > 0)
                groupSize = defaultGroups[0].members.length

            // Add lecture
            id = Lectures.insert({
                ownerId: user._id,
                courseTitle: course.title,
                courseCode: course.code,
                title: lectureTitle,
                active: false,
                groupSize: groupSize,
                createdAt: new Date()
            }, function (error) {
                if (error) {
                    throw new Meteor.Error("Insert Error", error.message,
                        error.message)
                }
            })

            // add Lecture to Course
            var updatedLectures = course.lectures
            updatedLectures.push(id)
            Courses.update(course._id, {
                $set: {lectures: updatedLectures}
            })

            // copy default group to lecture group
            for (var i = 0; i < defaultGroups.length; i++) {
                var group = defaultGroups[i]
                Groups.insert({
                    courseId: course._id,
                    lectureId: id,
                    creator: group.creator,
                    leader: group.leader,
                    name: group.name,
                    members: group.members,
                    active: true,
                    default: false,
                    createdAt: new Date()
                }, function (error) {
                    if (error) throw new Meteor.Error("Insert Group Error",
                        error.message, error.message)
                })
            }
        } else throw new Meteor.Error("Insert Error", "Access denied",
            "Access denied")
    },
    'enrollCourse': function (courseId, key) {
        var user = Meteor.user()
        var course = Courses.findOne(courseId)
        if (user && user.profile.accountType === 'student' &&
            course.status === 'active') {
            // Add user ID into existing course enrollment list
            var temp = course.students
            temp.push(user._id)
            Courses.update(course._id, {
                $set: {students: temp}
            }, function (error) {
                if (error)
                    throw new Meteor.Error("Update error", error.message,
                        error.message)
            })
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied");
    },
    'toggleLecture': function (lectureId, youtube) {
        var user = Meteor.user()
        var lecture = Lectures.findOne(lectureId)
        var course = Courses.findOne({code: lecture.courseCode})
        if (user && course && course.instructors.indexOf(user._id) >= 0) {
            Lectures.update(lectureId, {
                $set: {
                    active: !lecture.active,
                    youtube: youtube
                }
            }, function (error) {
                if (error) throw new Meteor.Error("Update error",
                    error.message, error.message)
            })
        }
    },
    'toggleLecturePermaLink': function (lectureId, youtube) {
        var user = Meteor.user()
        var lecture = Lectures.findOne(lectureId)
        var course = Courses.findOne({code: lecture.courseCode})

        if (user && course && course.instructors.indexOf(user._id) >= 0) {
             Lectures.update(lectureId, {
                 $set: {
                     available: !lecture.available,
                     youtube: youtube
                 }
             }, function (error) {
                 if (error) throw new Meteor.Error("Update error",
                     error.message, error.message)
             })
         }
    },
    'addDefaultStudents': function (courseCode, data) {
        let user = Meteor.user()
        let course = Courses.findOne({code: courseCode})
        if (user && course && course.ownerId == user._id) {
            let enrolledStudents = []
            let groups = {}
            for (let i = 0; i < data.length; i++) {
                let entry = data[i]
                if (entry.hasOwnProperty('StudentID')) {
                    enrolledStudents.push(entry['StudentID'])
                }
                if (entry.hasOwnProperty('StudentID') && entry.hasOwnProperty('Group')) {
                    let student = Meteor.users.findOne(entry['StudentID'])
                    let groupNumber = entry['Group']
                    if (student && groupNumber) {
                        temp = []
                        if (groups.hasOwnProperty(groupNumber))
                            temp = groups[groupNumber]
                        if (temp.indexOf(student._id) < 0)
                            temp.push(student._id)
                        groups[groupNumber] = temp
                    }
                }
            }
            Courses.update({code: courseCode}, {$set: {students: enrolledStudents}}, function (error) {
                if (error) throw new Meteor.Error("Insert Group Error",
                    error.message, error.message)
            })
            var oldGroups = Groups.find({
                courseId: course._id,
                default: true
            }).fetch()
            for (var i = 0; i < oldGroups.length; i++) {
                Groups.update(oldGroups[i]._id, {
                    $set: {
                        default: false
                    }
                }, function (error) {
                    if (error) throw new Meteor.Error("Update Group Error",
                        error.message, error.message)
                })
            }
            // add all group in groups to Groups collection
            for (var name in groups) {
                if (groups.hasOwnProperty(name)) {
                    var members = groups[name]
                    var leader = members[Math.floor(Math.random() * members.length)]
                    Groups.insert({
                        courseId: course._id,
                        creator: user._id,
                        leader: leader,
                        name: name,
                        members: members,
                        active: false,
                        default: true,
                        createdAt: new Date()
                    }, function (error) {
                        if (error) throw new Meteor.Error("Insert Group Error",
                            error.message, error.message)
                    })
                }
            }
        }
        else {
            throw new Meteor.Error("Update error", "Access denied",
                "Access denied")
        }
    },
    // 'addDefaultGroups': function (courseCode, data) {
    //     // add default group base on instructor's CSV
    //     var user = Meteor.user()
    //     var course = Courses.findOne({code: courseCode})
    //     if (user && course && course.ownerId == user._id) {
    //         // first create groups object where group name is the key and the
    //         // list of students are values
    //         var groups = {}
    //         for (var i = 0; i < data.length; i++) {
    //             var entry = data[i]
    //             if (entry.hasOwnProperty('ID') && entry.hasOwnProperty('Group')) {
    //                 var student = Meteor.users.findOne(entry['ID'])
    //                 var groupNumber = entry['Group']
    //                 if (student && groupNumber) {
    //                     temp = []
    //                     if (groups.hasOwnProperty(groupNumber))
    //                         temp = groups[groupNumber]
    //                     if (temp.indexOf(student._id) < 0)
    //                         temp.push(student._id)
    //                     groups[groupNumber] = temp
    //                 }
    //             }
    //         }
    //         // make previously created groups non-default
    //         var oldGroups = Groups.find({
    //             courseId: course._id,
    //             default: true
    //         }).fetch()
    //         for (var i = 0; i < oldGroups.length; i++) {
    //             Groups.update(oldGroups[i]._id, {
    //                 $set: {
    //                     default: false
    //                 }
    //             }, function (error) {
    //                 if (error) throw new Meteor.Error("Update Group Error",
    //                     error.message, error.message)
    //             })
    //         }
    //         // add all group in groups to Groups collection
    //         for (var name in groups) {
    //             if (groups.hasOwnProperty(name)) {
    //                 var members = groups[name]
    //                 var leader = members[Math.floor(Math.random() * members.length)]
    //                 Groups.insert({
    //                     courseId: course._id,
    //                     creator: user._id,
    //                     leader: leader,
    //                     name: name,
    //                     members: members,
    //                     active: false,
    //                     default: true,
    //                     createdAt: new Date()
    //                 }, function (error) {
    //                     if (error) throw new Meteor.Error("Insert Group Error",
    //                         error.message, error.message)
    //                 })
    //             }
    //         }
    //     } else {
    //         throw new Meteor.Error("Update error", "Access denied",
    //             "Access denied")
    //     }
    // },
    'updateGroupSettings': function (lectureId, groupSettings) {
        // Update lecture group settings
        // if the lecture has no group, randomly initialize groups base on
        // enrolled students, otherwise, use the existing group settings.
        var user = Meteor.user()
        var lecture = Lectures.findOne(lectureId)
        var course = Courses.findOne({code: lecture.courseCode})
        if (user && lecture && course &&
            course.instructors.indexOf(user._id) >= 0) {
            if (lecture.mode == 'group') {
                Lectures.update(lectureId, {
                    $set: {
                        mode: 'lecture'
                    }
                }, function (error) {
                    if (error) throw new Meteor.Error("Update error",
                        error.message, error.message)
                })
            } else {
                var students = course.students
                var groupSize = parseInt(groupSettings.groupSize)
                var existingGroups = Groups.find({
                    lectureId: lectureId,
                    active: true
                }).fetch()
                if (existingGroups.length <= 0 ||
                    parseInt(lecture.groupSize) != groupSize) {
                    // deactivate old existing groups
                    for (i = 0; i < existingGroups.length; i += 1) {
                        Groups.update(existingGroups[i]._id, {
                            $set: {
                                active: false
                            }
                        }, function (error) {
                            if (error) throw new Meteor.Error("Update error",
                                error.message, error.message)
                        })
                    }
                    // create new groups
                    var groups = []
                    for (i = 0; i < students.length; i += groupSize) {
                        groups.push(students.slice(i, i + groupSize))
                    }
                    for (i = 0; i < groups.length; i += 1) {
                        var members = groups[i]
                        var leader = members[Math.floor(Math.random() * members.length)]
                        Groups.insert({
                            lectureId: lecture._id,
                            courseId: course._id,
                            creator: user._id,
                            leader: leader,
                            name: (i + 1).toString(),
                            members: groups[i],
                            active: true,
                            createdAt: new Date()
                        }, function (error) {
                            if (error) throw new Meteor.Error("Update error",
                                error.message, error.message)
                        })
                    }
                }
                Lectures.update(lectureId, {
                    $set: {
                        mode: 'group',
                        displayQuestion: groupSettings.question,
                        groupSize: groupSettings.groupSize
                    }
                }, function (error) {
                    if (error) throw new Meteor.Error("Update error",
                        error.message, error.message)
                })
            }
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied");
    },
    'updateUserInfo': function (userId, userInfo) {
        var user = Meteor.user()
        if (user._id == userId) {
            Meteor.users.update(user._id, {
                $set: {
                    'profile.first_name': userInfo.firstname,
                    'profile.last_name': userInfo.lastname,
                    'profile.picture': userInfo.avatar
                }
            }, function (error) {
                if (error)
                    throw new Meteor.Error("Update error", error.message,
                        error.message)
            })
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied")
    },
    'updateLectureDisplayQuestion': function (lectureId, question) {
        var user = Meteor.user()
        var lecture = Lectures.findOne(lectureId)
        if (user && lecture && lecture.ownerId == user._id) {
            Lectures.update(lectureId, {
                $set: {displayQuestion: question}
            })
        }
    },
    'updateGroupDiscussion': function (groupId, discussion) {
        var user = Meteor.user()
        var group = Groups.findOne(groupId)
        if (user && group && user._id === group.leader) {
            Groups.update(groupId, {
                $set: {
                    discussion: discussion
                }
            }, function (error) {
                if (error) throw new Meteor.Error("Update error",
                    error.message, error.message)
            })
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied")
    },
    'addSpeechGroupDiscussion': function (lectureId, groupId, discussion) {
        var user = Meteor.user()
        var group = Groups.findOne(groupId)
        var lecture = Lectures.findOne(lectureId)
        if (user && group && lecture && discussion &&
            (group.leader.indexOf(user._id) >= 0 || lecture.ownerId == user._id)) {
            GroupDiscussion.insert({
                lectureId: lectureId,
                groupId: groupId,
                userId: user._id,
                transcript: discussion.transcript,
                confidence: discussion.confidence
            }, function (error) {
                if (error) throw new Meteor.Error("Insertion error",
                    error.message, error.message)
            })
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied")
    },
    'readAudioQuestion': function (audioId, status) {
        // set audio read filed to status
        var user = Meteor.user()
        var audio = Audios.collection.findOne(audioId)
        if (user && audio) {
            var lecture = Lectures.findOne(audio.meta.lectureId)
            var course = Courses.findOne({code: lecture.courseCode})
            if (course && course.instructors.indexOf(user._id) >= 0) {
                Audios.update(audioId, {
                    $set: {
                        meta: {
                            lectureId: audio.meta.lectureId,
                            groupId: audio.meta.groupId,
                            transcript: audio.meta.transcript,
                            confidence: audio.meta.confidence,
                            mode: audio.meta.mode,
                            read: status,
                            notified: audio.meta.notified
                        },
                        createdAt: audio.createdAt
                    }
                }, function (error) {
                    if (error) throw new Meteor.Error("Insertion error",
                        error.message, error.message)
                })
            }
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied")
    },
    'notifiedAudioQuestion': function (lectureId, questions) {
        // set audio notified field to true
        var user = Meteor.user()
        if (user && questions.length > 0) {
            var lecture = Lectures.findOne(lectureId)
            var course = Courses.findOne({code: lecture.courseCode})
            if (course && course.instructors.indexOf(user._id) >= 0) {
                for (var i = 0; i < questions.length; i++) {
                    var audio = questions[i]
                    Audios.update(audio._id, {
                        $set: {
                            meta: {
                                lectureId: audio.meta.lectureId,
                                groupId: audio.meta.groupId,
                                transcript: audio.meta.transcript,
                                confidence: audio.meta.confidence,
                                mode: audio.meta.mode,
                                read: audio.meta.read,
                                notified: true
                            },
                            createdAt: audio.createdAt
                        }
                    }, function (error) {
                        if (error) throw new Meteor.Error("Insertion error",
                            error.message, error.message)
                    })
                }

            }
        } else throw new Meteor.Error("Update error", "Access denied",
            "Access denied")
    }
});
