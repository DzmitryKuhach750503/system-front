import React from "react";
import '../../styles/main.css';
import {goLoginPage, goStudentGroupPage, goStudentProfilePage, goStudentRecordBookPage} from "../../redirect";
import axios from "axios";
import {
    AND_PARAM,
    DEFAULT_URL,
    GRADES_URL,
    GROUP_ID_PARAM,
    GROUP_INFOS_URL,
    Q_PARAM,
    SKIPS_URL,
    STUDENT_ID_PARAM, SUB_SUBJECT_ID_PARAM,
    SUB_SUBJECTS_URL,
    SUBJECT_FORMS_URL,
    SUBJECT_ID_PARAM,
    SUBJECT_TYPE_ID_PARAM,
    SUBJECTS_URL
} from "../../constants";
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleStudentMount from "../../handle/handleStudentMount";
import timeout from "../../handle/timeout";

class StudentSubjectsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            part: 0,
            subjects: [],
            grades: [],
            subjectForms: [],
            subjectInfo: {},
            groupInfo: {},
            skip: {}
        }
    }

    componentDidMount() {
        handleStudentMount(localStorage);
        this.getSubjects(localStorage.getItem("groupId"));
    }

    getSubjects(groupId) {
        axios.get(DEFAULT_URL + SUBJECTS_URL + Q_PARAM + GROUP_ID_PARAM + groupId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjects: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSubjectForms(subjectId) {
        axios.get(DEFAULT_URL + SUBJECT_FORMS_URL + Q_PARAM + SUBJECT_ID_PARAM + subjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjectForms: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSubjectInfo(subjectId, typeId) {
        axios.get(DEFAULT_URL + SUB_SUBJECTS_URL + Q_PARAM + SUBJECT_ID_PARAM + subjectId + AND_PARAM
            + SUBJECT_TYPE_ID_PARAM + typeId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                subjectInfo: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGrades(subSubjectId, studentId) {
        axios.get(DEFAULT_URL + GRADES_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + subSubjectId + AND_PARAM
            + STUDENT_ID_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                grades: response.data,
                avGrade: this.average(response.data)
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getSkip(subSubjectId, studentId) {
        axios.get(DEFAULT_URL + SKIPS_URL + Q_PARAM + SUB_SUBJECT_ID_PARAM + subSubjectId + AND_PARAM
            + STUDENT_ID_PARAM + studentId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                skip: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    getGroupInfo(subSubjectId, groupId) {
        axios.get(DEFAULT_URL + GROUP_INFOS_URL + Q_PARAM + GROUP_ID_PARAM + groupId + AND_PARAM
            + SUB_SUBJECT_ID_PARAM + subSubjectId, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                groupInfo: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
    }

    average(grades) {
        if (grades.length === 0) {
            return 0;
        } else {
            return (grades.reduce((total, next) => total + next.mark, 0) / grades.length).toFixed(1);
        }
    }

    async view(subjectId) {
        this.setState({
            part: 1,
            SId: subjectId
        });
        this.getSubjectForms(subjectId);
        await timeout(150);
    }

    async get(typeId) {
        const studentId = localStorage.getItem("id");
        const groupId = localStorage.getItem("groupId");
        this.getSubjectInfo(this.state.SId, typeId);
        await timeout(150);
        const subSubjectId = this.state.subjectInfo["id"];
        this.getGrades(subSubjectId, studentId);
        this.getSkip(subSubjectId, studentId);
        this.getGroupInfo(subSubjectId, groupId);
        await timeout(150);
        this.setState({
            part: 2,
            STId: typeId
        });
    }

    mainBar() {
        if (this.state.part > 0) {
            this.setState((state) => ({
                    part: state.part - 1
                }
            ));
        }
    }

    render() {
        return (
            <div className="main">
                <div className="bar">
                    <div className="sys_image"/>
                    <div className="sys_name">SYSTEM</div>
                    <a className="logout" onClick={() => goLoginPage(this.props)}>Выйти</a>
                    <a onClick={() => goStudentProfilePage(this.props)}>Профиль</a>
                    <a onClick={() => goStudentRecordBookPage(this.props)}>Зачётка</a>
                    <a onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a className="active" onClick={() => this.mainBar()}>Предметы</a>
                </div>
                <div className="main_data">
                    {this.state.part === 0 && (
                        <div className="data_panel">
                            {
                                this.state.subjects.map(subject => {
                                    return (
                                        <div>
                                            <button
                                                className="btn_data"
                                                value={subject.id}
                                                onClick={event => this.view(event.target.value)}
                                            >
                                                {subject.name}
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    )}
                    {this.state.part === 1 && (
                        <div className="data_panel small">
                            {this.state.subjectForms.map(subjectForm => {
                                return (
                                    <div>
                                        <button
                                            className="btn_data"
                                            value={subjectForm.id}
                                            onClick={event => this.get(event.target.value)}
                                        >
                                            {subjectForm.title}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {this.state.part === 2 && (
                        <div className="data_panel_student">
                            <h1>Предмет: {this.state.subjectInfo.subjectName}</h1>
                            <h1>Тип занятий: {this.state.subjectInfo.subjectForm}</h1>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Преподаватель:</div>
                                <div className="subject_detail_value">
                                    {this.state.subjectInfo.subjectTeacher}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Оценки:</div>
                                <div className="subject_detail_value">
                                    {this.state.grades.length !== 0 && this.state.grades.map(grade => {
                                        return grade.mark + " ";
                                    })}
                                    {this.state.grades.length === 0 && "Оценок нет"}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Средний балл:</div>
                                <div className="subject_detail_value">
                                    {this.state.avGrade}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Тип сдачи:</div>
                                <div
                                    className="subject_detail_value">
                                    {this.state.subjectInfo.offsetForm}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Количество пропусков:</div>
                                <div className="subject_detail_value">
                                    {this.state.skip.count}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Прошло занятий:</div>
                                <div className="subject_detail_value">
                                    {this.state.groupInfo.pastLessonsCount}
                                </div>
                            </div>
                            <div className="subject_detail">
                                <div className="subject_detail_name">Всего занятий:</div>
                                <div className="subject_detail_value">
                                    {this.state.subjectInfo.lessonsCount}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default StudentSubjectsPage;

