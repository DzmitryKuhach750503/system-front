import React from "react";
import axios from "axios";
import {
    goLoginPage,
    goStudentGroupPage,
    goStudentProfilePage,
    goStudentRecordBookPage,
    goStudentSubjectsPage
} from "../../redirect";
import {AND_PARAM, DEFAULT_URL, GROUP_ID_PARAM, Q_PARAM, STUDENTS_URL, SUBJECT_ID_PARAM} from "../../constants";
import '../../styles/main.css';
import handleDefaultError from "../../handle/handleDefaultReuqestError";
import handleStudentMount from "../../handle/handleStudentMount";

class StudentGroupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: []
        }
    }

    componentDidMount() {
        handleStudentMount(localStorage);
        this.getStudents();
    }

    getStudents() {
        const groupId = localStorage.getItem("groupId");
        axios.get(DEFAULT_URL + STUDENTS_URL + Q_PARAM + GROUP_ID_PARAM + groupId + AND_PARAM + SUBJECT_ID_PARAM, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                students: response.data
            });
        }).catch((error) => {
            handleDefaultError(this.props, error.response.status);
        });
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
                    <a className="active" onClick={() => goStudentGroupPage(this.props)}>Группа</a>
                    <a onClick={() => goStudentSubjectsPage(this.props)}>Предметы</a>
                </div>
                <div className="table_panel">
                    <div>
                        <h1 id='title'>Группа</h1>
                        <table id='data'>
                            <tbody>
                            <tr>
                                <th>№</th>
                                <th>Фамилия</th>
                                <th>Имя</th>
                                <th>Отчество</th>
                                <th>Email</th>
                            </tr>
                            {this.state.students.map((student, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{student.surname}</td>
                                        <td>{student.name}</td>
                                        <td>{student.patronymic}</td>
                                        <td>{student.email}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default StudentGroupPage;