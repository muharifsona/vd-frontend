import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { createLogin, deleteLoginById, findAllLogin, updateLogin } from "../../services/LoginService";
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";

const LoginAdminPage = () => {

    const [login, setLogin] = useState([]);
    const [loginDialog, setLoginDialog] = useState(false)
    const [deleteLoginDialog, setDeleteLoginDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [insertMode, setInsertMode] = useState(false)
    
    const emptyLogin = {
        username: null,
        nama: "",
        password: "",
        role: ""
    }

    const role = [ { role: "admin" }, { role: "dm" } ]

    const [log, setLog] = useState(emptyLogin);

    useEffect(() => {

        load()

    }, [])

    const load = async () => {
        try {
            const response = await findAllLogin()
            setLogin(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    const openNew = () => {
        setLog(emptyLogin)
        setInsertMode(true)
        setLoginDialog(true)
        setSubmitted(false)
    }

    const hideDialog = () => {
        setLoginDialog(false)
        setSubmitted(false)
    }

    const hideDeleteDialog = () => {
        setDeleteLoginDialog(false)
    }

    const editLogin = (log) => {
        setInsertMode(false)
        setSubmitted(false)
        setLog({...log})
        setLoginDialog(true)
    }

    const confirmDeleteLogin = (log) => {
        setLog(log);
        setDeleteLoginDialog(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-text p-button-plain p-mr-2" 
                    onClick={() => editLogin(rowData)} />
                <Button 
                    icon="pi pi-times" 
                    className="p-button-rounded p-button-text p-button-plain" 
                    onClick={() => confirmDeleteLogin(rowData)} />
            </React.Fragment>
        )
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < login.length; i++) {
            if (login[i].username === id) {
                index = i;
                break;
            } 
        }
        return index;
    }

    const saveLogin = async () => {
        try {
            setSubmitted(true)
            if (log.nama.trim()) {
                if (insertMode) {
                    const response = await createLogin(log);
                    const data = response.data;
                    const _login = [...login];
                    _login.push(data);
                    setLogin(_login);
                } else {
                    const response = await updateLogin(log)
                    const data = response.data
                    const _login = [...login]
                    const index = findIndexById(data.username)
                    _login[index] = data
                    setLogin(_login)
                }
                setInsertMode(false)
                setLoginDialog(false)
                setLog(emptyLogin)
                setSubmitted(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteLogin = async () => {
        try {
            await deleteLoginById(log.username)
            let _login = login.filter(val => val.username !== log.username)
            setLogin(_login)
            setDeleteLoginDialog(false)
            setLog(emptyLogin)
        } catch (error) {
            console.error(error)
        }
    }

    const loginDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Simpan Login" icon="pi pi-check" className="p-button-text" onClick={saveLogin}/>
        </React.Fragment>
    )

    const deleteLoginDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog}/>
            <Button label="Hapus Login" icon="pi pi-check" className="p-button-text" onClick={deleteLogin}/>
        </React.Fragment>
    )

    return (
        <MainPage>
            <div className='main-content'>
                <div className='content'>
                    <div className="content-inner">
                        <div className="content-header">
                            <h2>Login</h2>
                            <div className="p-d-inline">
                                <Button label="Tambah" icon="pi pi-plus" className="p-mr-2" onClick={openNew} />
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="content-data shadow-1">
                                <DataTable value={login} size="small" className="table-view" stripedRows>
                                    <Column field="username" header="Usernama"></Column>
                                    <Column field="nama" header="Nama"></Column>
                                    <Column field="role" header="Role"></Column>
                                    <Column body={actionBodyTemplate} style={{width: "120px", textAlign: "right"}}></Column>
                                </DataTable>
                                {/* {console.log(login.length)} */}
                            </div>
                        </div>

                        <Dialog 
                            visible={loginDialog} 
                            style={{width: "500px"}} 
                            header="Login" 
                            modal 
                            className="p-fluid" 
                            onHide={hideDialog} 
                            footer={loginDialogFooter}>
                            <div className="p-field">
                                <label htmlFor="nama">Nama</label>
                                <InputText id="nama" value={log.nama} 
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _log = {...log};
                                    _log.nama = val;
                                    setLog(_log);
                                }} />
                                {submitted && !log.nama && <small className="p-error">Nama Login harus diisi</small>}
                            </div>
                            {insertMode ? (
                                <div className="p-field">
                                    <label htmlFor="username">Username</label>
                                    <InputText id="username" value={log.username}
                                    onChange={(e) => {
                                        const val = (e.target && e.target.value) || '';
                                        const _log = {...log};
                                        _log.username = val;
                                        setLog(_log);
                                    }} />
                                    {submitted && !log.username && <small className="p-error">Username Login harus diisi</small>}
                                </div>
                            ) : ""}
                            <div className="p-field">
                                <label htmlFor="password">Password</label>
                                <Password id="password" value={log.password} toggleMask feedback={false}
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _log = {...log};
                                    _log.password = val;
                                    setLog(_log);
                                }} />
                                {submitted && !log.password && <small className="p-error">Password harus diisi</small>}
                            </div>
                            <div className="p-field">
                                <label htmlFor="role">Role</label>
                                <Dropdown
                                    optionLabel="role"
                                    optionValue="role"
                                    id="role"
                                    value={log.role}
                                    options={role}
                                    placeholder="Pilih Role"
                                    onChange={(e) => {
                                        const val = (e.target && e.target.value) || '';
                                        const _log = {...log};
                                        _log.role = val;
                                        setLog(_log);
                                    }}
                                />
                                {submitted && !log.role && <small className="p-error">Role harus diisi</small>}
                            </div>
                        </Dialog>

                        <Dialog 
                            visible={deleteLoginDialog}
                            style={{ width: "500px" }}
                            header="Konfirmasi"
                            modal
                            footer={deleteLoginDialogFooter}
                            onHide={hideDeleteDialog}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle p-mr-3"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                                <br/>
                                <br/>
                                {log && <span>Apakah anda yakin akan menghapus login <b>{log.username}</b>?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default LoginAdminPage;