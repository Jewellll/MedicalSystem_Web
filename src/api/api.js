import axios from 'axios';
import http from '../store/http'


let base = ''; //http://localhost:8443/api

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const requestPhoneLogin = params => { return axios.post(`${base}/phoneLogin`, params).then(res => res.data); };

export const requestMss = params => { return axios.post(`${base}/sendMss`, params).then(res => res.data); };

export const editUserInfo = params => { return axios.post(`${base}/editUser`, params).then(res => res.data); };

export const requireRegister = params => { return axios.post(`${base}/register`, params).then(res => res.data); };

//用户管理

export const getUserListPage = params => { return http.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return http.post(`${base}/user/remove`, params ).then(res => res.data); };

export const batchRemoveUser = params => { return http.post(`${base}/user/batchremove`, params ).then(res => res.data); };

export const editUser = params => { return http.get(`${base}/user/edit`,  params ).then(res => res.data); };

export const addUser = params => { return http.post(`${base}/user/add`,  params ).then(res => res.data); };

//教师管理
export const getTeacherListPage = params => { return http.get(`${base}/teacher/listpage`, { params: params }); };

export const editTeacher = params => { return http.get(`${base}/teacher/edit`, { params: params }); };

export const addTeacher = params => { return http.get(`${base}/teacher/add`, { params: params }); };

export const removeTeacher = params => { return http.get(`${base}/teacher/remove`, { params: params }); };

export const batchRemoveTeacher = params => { return http.get(`${base}/teacher/batchremove`, { params: params }); };

//学生管理
export const getStudentListPage = params => { return http.get(`${base}/student/listpage`, { params: params }); };

export const editStudent = params => { return http.get(`${base}/student/edit`, { params: params }); };

export const addStudent = params => { return http.get(`${base}/student/add`, { params: params }); };

export const removeStudent = params => { return http.get(`${base}/student/remove`, { params: params }); };

export const batchRemoveStudent = params => { return http.get(`${base}/student/batchremove`, { params: params }); };

//课程管理
export const getCourseListPage = params => { return http.get(`${base}/course/listpage`, { params: params }); };

export const editCourse = params => { return http.get(`${base}/course/edit`, { params: params }); };

export const addCourse = params => { return http.get(`${base}/course/add`, { params: params }); };

export const removeCourse = params => { return http.get(`${base}/course/remove`, { params: params }); };

export const batchRemoveCourse = params => { return http.get(`${base}/course/batchremove`, { params: params }); };

//字典管理
export const getDicListPage = params => { return http.get(`${base}/dictionaries/listpage`, { params: params }); };

export const editDic = params => { return http.get(`${base}/dictionaries/code`, { params: params }); };

export const addDic = params => { return http.get(`${base}/dictionaries/id`, { params: params }); };

export const removeDic = params => { return http.get(`${base}/dictionaries/remove`, { params: params }); };

export const batchRemoveDic = params => { return http.get(`${base}/dictionary/batchremove`, { params: params }); };

export const editDictionary = params => { return http.get(`${base}/dictionary/edit`, { params: params }); };

//系统参数管理

export const getParaListPage = params => { return http.get(`${base}/systemManage/listpage`, { params: params }); };

export const editPara = params => { return http.get(`${base}/systemManage/edit`, { params: params }); };

export const addPara = params => { return http.get(`${base}/systemManage/add`, { params: params }); };

export const removePara = params => { return http.get(`${base}/systemManage/remove`, { params: params }); };

export const batchRemovePara = params => { return http.get(`${base}/systemManage/batchremove`, { params: params }); };

