import axios from 'axios'
import http from '../store/http'

let base = '' // http://localhost:8443/api

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const requestPhoneLogin = params => { return axios.post(`${base}/phoneLogin`, params).then(res => res.data) }

export const editUserInfo = params => { return axios.put(`${base}/user/updateUser`, params).then(res => res.data) }

export const requireRegister = params => { return axios.post(`${base}/register`, params).then(res => res.data) }

// 用户管理

export const getUserListPage = params => { return http.post(`${base}/user/selectAllUser/` + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const removeUser = params => { return http.delete(`${base}/user/deleteUserByUserid/` + params.userId).then(res => res.data) }

export const getUserListByRealName = params => { return http.get(`${base}/user/getUserByRealName`, params).then(res => res.data) }

export const getUserListByUserName = params => { return http.get(`${base}/user/getUserByUserName/` + params.username).then(res => res.data) }

export const batchRemoveUser = params => { return http.delete(`${base}/user/deleteUserAllByuserId`, {data:params}).then(res => res.data) }

export const editUser = params => { return http.put(`${base}/user/updateUser`, params).then(res => res.data) }

export const addUser = params => { return http.post(`${base}/user/add`, params).then(res => res.data) }

// 教师管理
export const getTeacherListPage = params => { return http.get(`${base}/teacher/listpage`, params).then(res => res.data) }

export const editTeacher = params => { return http.get(`${base}/teacher/edit`, params).then(res => res.data) }

export const addTeacher = params => { return http.get(`${base}/teacher/add`, params).then(res => res.data) }

export const removeTeacher = params => { return http.get(`${base}/teacher/remove`, params).then(res => res.data) }

export const batchRemoveTeacher = params => { return http.get(`${base}/teacher/batchremove`, params).then(res => res.data) }

// 学生管理
export const getStudentListPage = params => { return http.get(`${base}/student/listpage`, params).then(res => res.data) }

export const editStudent = params => { return http.get(`${base}/student/edit`, params).then(res => res.data) }

export const addStudent = params => { return http.get(`${base}/student/add`, params).then(res => res.data) }

export const removeStudent = params => { return http.get(`${base}/student/remove`, params).then(res => res.data) }

export const batchRemoveStudent = params => { return http.get(`${base}/student/batchremove`, params).then(res => res.data) }

// 课程管理
export const getCourseListPage = params => { return http.get(`${base}/course/findAllCourse/` + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const addCourse = params => { return http.post(`${base}/course/insertCourse`, params).then(res => res.data) }

export const addCourseTeachers = params => { return http.post(`${base}/course/insertCourseTeacher`, params).then(res => res.data) }

export const addCourseStudents = params => { return http.post(`${base}/course/insertCourseStudent`, params).then(res => res.data) }

export const findStudents = params => { return http.get(`${base}/user/findAllStudent`).then(res => res.data) }

export const findTeachers = params => { return http.get(`${base}/user/findAllTeacher`).then(res => res.data) }

export const findAddedCourse = params => { return http.get(`${base}/course/findCourseBySId/` + params.studentId).then(res => res.data) }

export const findOtherCourse = params => { return http.get(`${base}/course/findUnjoinCourseBySId/` + params.studentId).then(res => res.data) }

export const addCoursePost = params => { return http.post(`${base}/course/insertApproveRequest`, params).then(res => res.data) }

export const getCourseDetailPage = params => { return http.get(`${base}/course/findCourseByCourseId/` + params.courseId).then(res => res.data) }

export const getCourseStudents = params => { return http.get(`${base}/team/findNotTeamStudentByCourseId/` + params.courseId) }

export const createTeam = params => { return http.post(`${base}/course/setStudentGroup`, params).then(res => res.data) }

export const removeTeam = params => { return http.post(`${base}/team/deleteTeamByCIdSId/` + params.courseId + '/' + params.teamId).then(res => res.data) }

export const getTeamMembers = params => { return http.get(`${base}/team/findTeamStudent/` + params.courseId + '/' + params.studentId).then(res => res.data) }

export const getCaseListByCourse = params => { return http.get(`${base}/case/findCasesbycourseId/` + params.courseId + '/' + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const getTeamListByCourse = params => { return http.get(`${base}/team/findInTeamStudentByCourseId/` + params.courseId + '/' + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const getTeamStudent = params => { return http.get(`${base}/team/findTeamStudent/` + params.courseId + '/' + params.teamId).then(res => res.data) }

export const changeTeam = params => { return http.post(`${base}/team/updateOneStudentFromTeam/` + params.courseId + '/' + params.teamId + '/' + params.studentId).then(res => res.data) }

export const delStudent = params => { return http.post(`${base}/team/deleteOneStudentFromTeam/` + params.courseId + '/' + params.teamId + '/' + params.studentId).then(res => res.data) }

export const removeCourse = params => { return http.post(`${base}/course/deleteCourse/` + params.courseId).then(res => res.data) }

export const batchRemoveCourse = params => { return http.get(`${base}/course/batchremove`, params).then(res => res.data) }

// 字典管理
export const getDicListPage = params => { return http.get(`${base}/dictionaries/listpage`, params).then(res => res.data) }

export const editDic = params => { return http.get(`${base}/dictionaries/code`, params).then(res => res.data) }

export const addDic = params => { return http.get(`${base}/dictionaries/id`, params).then(res => res.data) }

export const removeDic = params => { return http.get(`${base}/dictionaries/remove`, params).then(res => res.data) }

export const batchRemoveDic = params => { return http.get(`${base}/dictionary/batchremove`, params).then(res => res.data) }

export const editDictionary = params => { return http.get(`${base}/dictionary/edit`, params).then(res => res.data) }

// 案例管理

export const getCaseListPage = params => { return http.post(`${base}/case/findCasesByPage/` + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const getCaseListByCaseName = params => { return http.get(`${base}/case/findCasesbycaseName/` + params.caseName + '/' + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const removeCase = params => { return http.delete(`${base}/case/deletecase/` + params.caseId).then(res => res.data) }

export const batchRemoveCase = params => { return http.delete(`${base}/case/batchdeletecase`, {data:params}).then(res => res.data) }

export const getCaseDetail = params => { return http.get(`${base}/case/findCasesbycaseId/` + params.caseId).then(res => res.data) }

export const getReplyCaseDetail = params => { return http.get(`${base}/case/findCasesbycaseId/` + params.caseId).then(res => res.data) }

export const getReplyCaseImg = params => { return http.get(`${base}/case/readimage/` + params.caseId).then(res => res.data) }
// 评论

export const getCommentList = params => { return http.get(`${base}/comment/getComments/` + params.caseId).then(res => res.data) }

export const requestComment = params => { return http.post(`${base}/comment/addComment`, params).then(res => res.data) }

// 编辑添加案例

export const getCaseToEdit = params => { return http.get(`${base}/case/findCasesbycaseId/` + params.caseId).then(res => res.data) }

export const editCse = params => { return http.put(`${base}/case/updatecase`, params).then(res => res.data) }

export const addCase = params => { return http.post(`${base}/case/insertcase`, params).then(res => res.data) }

// 文件

export const getCaseDetailFile = params => { return http.get(`${base}/case/getFileByCaseId/` + params.caseId).then(res => res.data) }

export const downloadFile = params => { return http.post(`${base}/sfile/downloadFile/` + params.fileId).then(res => res.data) }

export const downloadCaseFile = params => { return http.post(`${base}/case/downloadFileFromCasesbyid/` + params.id).then(res => res.data) }

export const getCaseFile = params => { return http.get(`${base}/sfile/getFileByCaseId/` + params.caseId + '/' + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const removeTeacherFile = params => { return http.delete(`${base}/case/deleteCaseFileById/` + params.id).then(res => res.data) }

export const removeStudentFile = params => { return http.delete(`${base}/sfile/deleteFile/`+params.fileId).then(res => res.data) }

// 字典管理
export const getPageDict = params => { return http.get(`${base}/dict/selectAllDictionaryType/` + params.pageNum + '/' + params.pageSize).then(res => res.data) }

export const getEditValue = params => { return http.get(`${base}/dict/getDictionaryDetailByTypeCode/` + params.typeCode).then(res => res.data) }

export const updateEditVal = params => { return http.put(`${base}/dict/updateDictionaryDetail`, params).then(res => res.data) }

export const queryDict = params => { return http.get(`${base}/dict/getDictionaryTypeBytypeName/` + params).then(res => res.data) }

export const delEditVal = params => { return http.delete(`${base}/dict/deleteDictionaryDetailByValueAndTypeCode/` + params.id).then(res => res.data) }

export const getCaseId = params => { return http.post(`${base}/case/intoinsertcase` ,params).then(res => res.data) }

export const deleteCaseImg = params => { return http.delete(`${base}/case/deletecaseimageByCaseId/` + params.caseId ).then(res => res.data) }

export const deleteCaseFile = params => { return http.delete(`${base}/case/deleteCaseFileByCaseId/`+ params.caseId ).then(res => res.data) }

//图片管理

export const getCaseImage = params => { return http.get(`${base}/case/readimage/`+ params.caseId ).then(res => res.data) }

export const batchRemoveFile = params => { return http.delete(`${base}/sfile/deleteBatchFiles`,{data:params}).then(res => res.data) }

export const removeImage = params => { return http.delete(`${base}/case/deletecaseimage/`+ params.id ).then(res => res.data) }
//分配菜单
export const requestMenu = params => { return http.get(`${base}/menu/getByUserId/`+ params.id ).then(res => res.data) }
//发生验证码
export const requestMss = params => { return http.get(`${base}/getMail/`+ params.mail).then(res => res.data) }

export const editPwd = params => { return http.get(`${base}/updatePassword`,params).then(res => res.data) }
export const delEditVal = params => { return http.delete(`${base}/dict/deleteDictionaryDetailById/` + params.id).then(res => res.data) }

export const deleteDicBatch = params => { return http.delete(`${base}/dict/deleteDictionaryAllById`, params).then(res => res.data) }
