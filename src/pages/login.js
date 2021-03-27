import React from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {
    goAdminSubjectsPage,
    goLoginPage,
    goServerErrorPage,
    goStudentSubjectsPage,
    goTeacherMainPage
} from "../redirect";
import * as constants from '../constants';
import '../styles/admin.css';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            isPasswordVisibility: false,
            values: {
                id: '',
                password: ''
            }
        }
    }

    login() {
        this.authenticate();
    }

    change(event) {
        this.setState({
            values: {
                ...this.state.values,
                [event.target.name]: event.target.value
            }
        });
    }

    changeVisibility() {
        this.setState((state) => ({
            isPasswordVisibility: !state.isPasswordVisibility
        }));
    }

    authenticate() {
        axios.post(constants.DEFAULT_URL + constants.AUTHENTICATION_URL, {
            id: this.state.values.id,
            password: this.state.values.password
        })
            .then(response => {
                localStorage.clear();
                const role = response.data["role"];
                const token = response.data["jwtToken"];
                const id = this.state.values.id;
                localStorage.setItem("role", role);
                localStorage.setItem("token", token);
                localStorage.setItem("id", id);
                this.goByRole(role, id);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 400) {
                    this.setState({
                        isError: true
                    })
                }
            });
    }

    getGroup(id) {
        axios.get(constants.DEFAULT_URL + "/groups/students/" + id)
            .then(response => {
                console.log(response.data.id);
                localStorage.setItem("groupId", response.data.id);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    goServerErrorPage(this.props);
                } else if (error.response.status === 401) {
                    goLoginPage(this.props);
                }
            });
    }

    goByRole(role, id) {
        if (role === constants.STUDENT_ROLE) {
            this.getGroup(id);
            goStudentSubjectsPage(this.props);
        } else if (role === constants.TEACHER_ROLE) {
            goTeacherMainPage(this.props);
        } else if (role === constants.ADMIN_ROLE) {
            goAdminSubjectsPage(this.props);
        }
    }

    render() {
        return (
            <div className="main">
                <div className="image">
                    <svg className="img"/>
                </div>
                <div className="panel_add big">
                    <div className="begin_add">
                        Вход в систему
                    </div>
                    <div className="part_add">
                        <div className="description_add">
                            ID
                        </div>
                        <input
                            name="id"
                            type="text"
                            placeholder="Введите ваш ID"
                            className="in_data_add"
                            value={this.state.values.id}
                            onChange={event => this.change(event)}
                        />
                    </div>
                    <div className="part_add">
                        <div className="description_add">
                            Пароль
                        </div>
                        <input
                            name="password"
                            className="in_data_add"
                            type={this.state.isPasswordVisibility ? "text" : "password"}
                            placeholder="Введите ваш пароль"
                            value={this.state.values.password}
                            onChange={event => this.change(event)}
                        />
                    </div>
                    <input type="checkbox"
                           id="check"
                           className="check_recovery"
                           onChange={() => this.changeVisibility()}
                    />
                    <label htmlFor="check">Посмотреть пароль</label>
                    {this.state.isError && (
                        <div className="error_panel_add">
                            ID или пароль не верны
                        </div>
                    )}
                    <div className="repair_panel">
                        <Link to="/recovery">Забыли пароль? Восстановите его.</Link>
                    </div>
                    <button
                        className="btn_add"
                        onClick={() => this.login()}
                    >
                        Войти
                    </button>
                </div>
            </div>
        )
    }
}

export default LoginPage;