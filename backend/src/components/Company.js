import React, { Component } from 'react';
import Env from '../config/env.config';
import { strings as commonStrings } from '../lang/common';
import { strings as companiesStrings } from '../lang/companies';
import CompanyService from '../services/CompanyService';
import CarService from '../services/CarService';
import Helper from '../common/Helper';
import Master from '../elements/Master';
import Backdrop from '../elements/SimpleBackdrop';
import { Avatar } from '../elements/Avatar';
import CarList from '../elements/CarList';
import Error from './Error';
import NoMatch from './NoMatch';
import { toast } from 'react-toastify';
import {
    Typography,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Edit as EditIcon,
    Mail as MailIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

import '../assets/css/company.css';

export default class Company extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            company: null,
            error: false,
            visible: false,
            isLoading: true,
            noMatch: false,
            openDeleteDialog: false,
            cars: [],
            page: 1,
            checkedCompanies: []
        };
    }

    onBeforeUpload = () => {
        this.setState({ isLoading: true });
    };

    onAvatarChange = _ => {
        this.setState({ isLoading: false });
    };

    handleDelete = _ => {
        this.setState({ openDeleteDialog: true });
    };

    handleConfirmDelete = _ => {
        const { company } = this.state;

        this.setState({ isLoading: true, openDeleteDialog: false }, _ => {
            CompanyService.delete(company._id).then(status => {
                if (status === 200) {
                    window.location.href = '/companies';
                } else {
                    toast(commonStrings.GENERIC_ERROR, { type: 'error' });
                    this.setState({ isLoading: false });
                }
            }).catch(_ => {
                toast(commonStrings.GENERIC_ERROR, { type: 'error' })
                this.setState({ isLoading: false });
            });
        });
    };

    handleCancelDelete = _ => {
        this.setState({ openDeleteDialog: false });
    };

    fetch = _ => {
        const { page, checkedCompanies, cars } = this.state;
        const payload = checkedCompanies;

        this.setState({ isLoading: true });
        CarService.getCars('', payload, page, Env.CARS_PAGE_SIZE)
            .then(data => {
                const _cars = page === 1 ? data : [...cars, ...data];
                this.setState({ cars: _cars, isLoading: false, fetch: data.length > 0 });
            })
            .catch(_ => toast(commonStrings.GENERIC_ERROR, { type: 'error' }));
    };

    onLoad = (user) => {
        this.setState({ user, isLoading: true }, _ => {
            const params = new URLSearchParams(window.location.search);
            if (params.has('c')) {
                const id = params.get('c');
                if (id && id !== '') {
                    CompanyService.getCompany(id)
                        .then(company => {
                            if (company) {
                                this.setState({
                                    company,
                                    checkedCompanies: [company._id],
                                    fullName: company.fullName,
                                    phone: company.phone,
                                    location: company.location,
                                    bio: company.bio,
                                    visible: true
                                }, _ => {
                                    this.fetch();

                                    const div = document.querySelector('.col-2');
                                    if (div) {
                                        div.onscroll = (event) => {
                                            const { fetch, isLoading, page } = this.state;
                                            if (fetch && !isLoading && (window.innerHeight + event.target.scrollTop) >= (event.target.scrollHeight - Env.PAGE_FETCH_OFFSET)) {
                                                this.setState({ page: page + 1 }, _ => {
                                                    this.fetch();
                                                });
                                            }
                                        };
                                    }
                                });
                            } else {
                                this.setState({ isLoading: false, noMatch: true });
                            }
                        })
                        .catch(_ => {
                            this.setState({ isLoading: false, error: true, visible: false });
                        });
                } else {
                    this.setState({ isLoading: false, noMatch: true });
                }
            } else {
                this.setState({ isLoading: false, noMatch: true });
            }
        });
    }

    componentDidMount() {
    }

    render() {
        const { visible, isLoading, error, noMatch, user, company, cars, openDeleteDialog } = this.state;
        const edit = (user && company) && (user.type === Env.RECORD_TYPE.ADMIN || user._id === company._id);

        return (
            <Master onLoad={this.onLoad} strict={true}>
                {visible &&
                    <div className='company'>
                        <div className='col-1'>
                            <section className='company-avatar-sec'>
                                {edit ? (<Avatar
                                    record={company}
                                    type={Env.RECORD_TYPE.COMPANY}
                                    mode='update'
                                    size='large'
                                    hideDelete
                                    onBeforeUpload={this.onBeforeUpload}
                                    onChange={this.onAvatarChange}
                                    readonly={!edit}
                                    color='disabled'
                                    className='company-avatar' />)
                                    :
                                    <div className='car-company'>
                                        <span className='car-company-logo'>
                                            <img src={Helper.joinURL(Env.CDN_USERS, company.avatar)}
                                                alt={company.fullName}
                                                style={{
                                                    width: Env.COMPANY_IMAGE_WIDTH,
                                                    // height: Env.COMPANY_IMAGE_HEIGHT
                                                }}
                                            />
                                        </span>
                                        <span className='car-company-info'>
                                            {company.fullName}
                                        </span>
                                    </div>
                                }
                            </section>
                            {edit && <Typography variant="h4" className="company-name">{company.fullName}</Typography>}
                            {company.bio && company.bio !== '' && <Typography variant="h6" className="company-info">{company.bio}</Typography>}
                            {company.location && company.location !== '' && <Typography variant="h6" className="company-info">{company.location}</Typography>}
                            {company.phone && company.phone !== '' && <Typography variant="h6" className="company-info">{company.phone}</Typography>}
                            {edit && <div className="company-actions">
                                <IconButton href={`/update-company?c=${company._id}`}>
                                    <EditIcon />
                                </IconButton>
                                {user._id !== company._id && <IconButton>
                                    <MailIcon />
                                </IconButton>}
                                <IconButton data-id={company._id} onClick={this.handleDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>}
                        </div>
                        <div className='col-2'>
                            <CarList
                                user={user}
                                cars={cars}
                                isLoading={isLoading}
                                hideCompany
                            />
                        </div>
                    </div>
                }
                <Dialog
                    disableEscapeKeyDown
                    maxWidth="xs"
                    open={openDeleteDialog}
                >
                    <DialogTitle>{commonStrings.CONFIRM_TITLE}</DialogTitle>
                    <DialogContent>{companiesStrings.DELETE_COMPANY}</DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancelDelete} variant='contained' className='btn-secondary'>{commonStrings.CANCEL}</Button>
                        <Button onClick={this.handleConfirmDelete} variant='contained' color='error'>{commonStrings.DELETE}</Button>
                    </DialogActions>
                </Dialog>
                {isLoading && <Backdrop text={commonStrings.LOADING} />}
                {error && <Error />}
                {noMatch && <NoMatch />}
            </Master>
        );
    }
}