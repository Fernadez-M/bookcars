import React, { Component } from 'react';
import Master from '../elements/Master';
import Env from '../config/env.config';
import { strings as commonStrings } from '../lang/common';
import { strings } from '../lang/reset-password';
import UserService from '../services/UserService';
import Backdrop from '../elements/SimpleBackdrop';
import NoMatch from './NoMatch';
import Error from './Error';
import { toast } from 'react-toastify';
import {
    Paper,
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Button
} from '@mui/material';

import '../assets/css/reset-password.css';

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userId: '',
            newPassword: '',
            confirmPassword: '',
            newPasswordError: false,
            confirmPasswordError: false,
            passwordLengthError: false,
            error: false,
            isLoading: false,
            noMatch: false,
            currentPassword: '',
            currentPasswordError: false,
        };
    }

    handleNewPasswordChange = (e) => {
        this.setState({ newPassword: e.target.value });
    };

    handleConfirmPasswordChange = (e) => {
        this.setState({ confirmPassword: e.target.value });
    };

    handleOnConfirmPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    };

    handleCurrentPasswordChange = (e) => {
        this.setState({ currentPassword: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        const submit = _ => {

            if (this.state.newPassword.length < 6) {
                this.setState({
                    passwordLengthError: true,
                    confirmPasswordError: false,
                    newPasswordError: false
                });
                return;
            } else {
                this.setState({
                    passwordLengthError: false,
                    newPasswordError: false
                });
            }

            if (this.state.newPassword !== this.state.confirmPassword) {
                this.setState({
                    confirmPasswordError: true,
                    newPasswordError: false
                });
                return;
            } else {
                this.setState({
                    confirmPasswordError: false,
                    newPasswordError: false
                });
            }

            const { user, userId, currentPassword, newPassword, strict } = this.state;
            const data = {
                _id: userId,
                password: user.password,
                newPassword,
                strict
            };

            if (userId === user._id && currentPassword === newPassword) {
                this.setState({
                    newPasswordError: true,
                    passwordLengthError: false,
                    confirmPasswordError: false,
                });
                return;
            }

            UserService.resetPassword(data)
                .then(status => {
                    if (status === 200) {
                        if (user._id === userId) {
                            UserService.getUser(user._id)
                                .then(_user => {
                                    if (_user) {
                                        this.setState({ user: _user, newPasswordError: false, currentPassword: '', newPassword: '', confirmPassword: '' });
                                        toast(strings.PASSWORD_UPDATE, { type: 'info' });
                                    } else {
                                        toast(strings.PASSWORD_UPDATE_ERROR, { type: 'error' });
                                    }
                                })
                                .catch(_ => {
                                    toast(strings.PASSWORD_UPDATE_ERROR, { type: 'error' });
                                });
                        } else {
                            this.setState({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            toast(strings.PASSWORD_UPDATE, { type: 'info' });
                        }
                    } else {
                        toast(strings.PASSWORD_UPDATE_ERROR, { type: 'error' });
                    }
                })
                .catch(_ => {
                    toast(strings.PASSWORD_UPDATE_ERROR, { type: 'error' });
                });
        };

        const { user, currentPassword } = this.state;

        UserService.compare(currentPassword, user.password).then((passwordMatch) => {
            this.setState({
                currentPasswordError: !passwordMatch,
                newPasswordError: false,
                passwordLengthError: false,
                confirmPasswordError: false
            });

            if (passwordMatch) {
                submit();
            }
        });

    };

    onLoad = (user) => {
        this.setState({ user });

        const params = new URLSearchParams(window.location.search);
        if (params.has('u')) {
            const id = params.get('u');
            if (id && id !== '') {
                if (id === user._id) {
                    this.setState({ userId: user._id, visible: true, isLoading: false });
                } else {
                    if (user.type === Env.RECORD_TYPE.ADMIN) {
                        UserService.getUser(id)
                            .then(_user => {
                                if (_user) {
                                    this.setState({ userId: _user._id, visible: true, isLoading: false });
                                } else {
                                    this.setState({ isLoading: false, noMatch: true });
                                }
                            })
                            .catch(err => {
                                this.setState({ isLoading: false, error: true, visible: false });
                            });
                    } else {
                        this.setState({ isLoading: false, noMatch: true });
                    }
                }
            } else {
                this.setState({ isLoading: false, noMatch: true });
            }
        } else {
            this.setState({ isLoading: false, noMatch: true });
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true, visible: false });
    }

    render() {
        const { userId, user, visible, currentPassword, newPassword, confirmPassword,
            currentPasswordError, newPasswordError, confirmPasswordError,
            passwordLengthError, isLoading, error, noMatch } = this.state;

        return (
            <Master onLoad={this.onLoad} strict={true}>
                <div className="password-reset" style={visible ? null : { display: 'none' }}>
                    <Paper className="password-reset-form password-reset-form-wrapper" elevation={10}>
                        <h1 className="password-reset-form-title"> {strings.PASSWORD_RESET_HEADING} </h1>
                        <form className="form" onSubmit={this.handleSubmit}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel
                                    error={currentPasswordError}
                                    className='required'
                                >
                                    {user && userId === user._id ? strings.CURRENT_PASSWORD : strings.YOUR_PASSWORD}
                                </InputLabel>
                                <Input
                                    id="password-current"
                                    onChange={this.handleCurrentPasswordChange}
                                    value={currentPassword}
                                    error={currentPasswordError}
                                    type='password'
                                    required
                                />
                                <FormHelperText
                                    error={currentPasswordError}
                                >
                                    {(currentPasswordError && strings.CURRENT_PASSWORD_ERROR) || ''}
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                fullWidth
                                margin="dense"
                            >
                                <InputLabel className='required' error={newPasswordError}>
                                    {strings.NEW_PASSWORD}
                                </InputLabel>
                                <Input
                                    id="password-new"
                                    onChange={this.handleNewPasswordChange}
                                    type='password'
                                    value={newPassword}
                                    error={newPasswordError}
                                    required
                                />
                                <FormHelperText
                                    error={newPasswordError}
                                >
                                    {(newPasswordError && strings.NEW_PASSWORD_ERROR) || ''}
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                fullWidth
                                margin="dense"
                                error={confirmPasswordError}
                            >
                                <InputLabel
                                    error={confirmPasswordError}
                                    className='required'
                                >
                                    {commonStrings.CONFIRM_PASSWORD}
                                </InputLabel>
                                <Input
                                    id="password-confirm"
                                    onChange={this.handleConfirmPasswordChange}
                                    onKeyDown={this.handleOnConfirmPasswordKeyDown}
                                    error={confirmPasswordError || passwordLengthError}
                                    type='password'
                                    value={confirmPassword}
                                    required
                                />
                                <FormHelperText
                                    error={confirmPasswordError || passwordLengthError}
                                >
                                    {confirmPasswordError
                                        ? commonStrings.PASSWORDS_DONT_MATCH
                                        : (passwordLengthError ? commonStrings.ERROR_IN_PASSWORD : '')}
                                </FormHelperText>
                            </FormControl>
                            <div className='buttons'>
                                <Button
                                    type="submit"
                                    className='btn-primary btn-margin btn-margin-bottom'
                                    size="small"
                                    variant='contained'
                                >
                                    {commonStrings.RESET_PASSWORD}
                                </Button>
                                <Button
                                    className='btn-secondary btn-margin-bottom'
                                    size="small"
                                    variant='contained'
                                    href="/"
                                >
                                    {commonStrings.CANCEL}
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </div>
                {isLoading && <Backdrop text={commonStrings.PLEASE_WAIT} />}
                {error && <Error />}
                {noMatch && <NoMatch />}
            </Master>
        );
    }
}