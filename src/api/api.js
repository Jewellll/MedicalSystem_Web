import axios from 'axios'
import http from '../store/http'

let base = '' // http://localhost:8443/api

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }

export const requestPhoneLogin = params => { return axios.post(`${base}/phoneLogin`, params).then(res => res.data) }

export const requestMss = params => { return axios.post(`${base}/sendMss`, params).then(res => res.data) }

export const editUserInfo = params => { return axios.post(`${base}/editUser`, params).then(res => res.data) }

export const requireRegister = params => { return axios.post(`${base}/register`, params).then(res => res.data) }

// 用户管理

export const getUserListPage = params => { return http.get(`${base}/user/listpage`, { params: params }) }

export const removeUser = params => { return http.post(`${base}/user/remove`, params).then(res => res.data) }

export const batchRemoveUser = params => { return http.post(`${base}/user/batchremove`, params).then(res => res.data) }

export const editUser = params => { return http.get(`${base}/user/edit`, params).then(res => res.data) }

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

// export const editCourse = params => { return http.get(`${base}/course/edit`,  params).then(res => res.data); };

export const addCourse = params => { return http.post(`${base}/course/insertCourse`, params).then(res => res.data) }

export const addCourseTeachers = params => { return http.post(`${base}/course/insertCourseTeacher`, params).then(res => res.data) }

export const addCourseStudents = params => { return http.post(`${base}/course/insertCourseStudent`, params).then(res => res.data) }

export const findStudents = params => { return http.get(`${base}/user/findAllStudent`).then(res => res.data) }

export const findTeachers = params => { return http.get(`${base}/user/findAllTeacher`).then(res => res.data) }

export const findAddedCourse = params => { return http.get(`${base}/course/findCourseBySId/` + params.studentId).then(res => res.data) }

export const findOtherCourse = params => { return http.get(`${base}/course/findUnjoinCourseBySId/` + params.studentId).then(res => res.data) }

export const addCoursePost = params => { return http.post(`${base}/course/insertApproveRequest`, params).then(res => res.data) }

export const getCourseDetailPage = params => {}

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

export const getCaseListPage = params => { return http.get(`${base}/case/listpage`, params).then(res => res.data) }

// export const editTeacher = params => { return http.get(`${base}/teacher/edit`, { params: params }); };
// export const addTeacher = params => { return http.get(`${base}/teacher/add`, { params: params }); };
// export const removeTeacher = params => { return http.get(`${base}/teacher/remove`, { params: params }); };
// export const batchRemoveTeacher = params => { return http.get(`${base}/teacher/batchremove`, { params: params }); };

// 创建案例

// 课程详情

// 删除课程

export const removeCase = params => { return http.get(`${base}/case/remove`, params).then(res => res.data) }

export const batchRemoveCase = params => { return http.get(`${base}/case/batchremove`, params).then(res => res.data) }
// 评论

export const getCommentList = params => { return http.get(`${base}/comment/getComments/` + params.caseId).then(res => res.data) }

export const requestComment = params => { return http.post(`${base}/comment/addComment`, params).then(res => res.data) }

// 编辑案例

export const getCaseToEdit = params => { return http.post(`${base}/case/getCase`, params).then(res => res.data) }

export const editCse = params => { return http.post(`${base}/case/editCase`, params).then(res => res.data) }

export const addCase = params => { return http.post(`${base}/case/editCase`, params).then(res => res.data) }
