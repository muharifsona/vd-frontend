import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { createAlternatif, deleteAlternatifById, findAllAlternatif, updateAlternatif } from "../../services/AlternatifService";
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const AlternatifAdminPage = () => {

    const [alternatif, setAlternatif] = useState([]);
    const [alternatifDialog, setAlternatifDialog] = useState(false)
    const [deleteAlternatifDialog, setDeleteAlternatifDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [insertMode, setInsertMode] = useState(false)
    
    const emptyAlternatif = {
        id: null,
        nama_alternatif: "",
        deskripsi: ""
    }
    const [alt, setAlt] = useState(emptyAlternatif);

    useEffect(() => {

        load()

    }, [])

    const load = async () => {
        try {
            const response = await findAllAlternatif()
            setAlternatif(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    // const test = () => {
    //     for (let i = 0; i < alternatif.length; i++) {
    //         console.log(alternatif[i].bobot_alternatif*2)
    //     }
    // }

    // test();

    const openNew = () => {
        setAlt(emptyAlternatif)
        setInsertMode(true)
        setAlternatifDialog(true)
        setSubmitted(false)
    }

    const hideDialog = () => {
        setAlternatifDialog(false)
        setSubmitted(false)
    }

    const hideDeleteDialog = () => {
        setDeleteAlternatifDialog(false)
    }

    const editAlternatif = (alt) => {
        setInsertMode(false)
        setSubmitted(false)
        setAlt({...alt})
        setAlternatifDialog(true)
    }

    const confirmDeleteAlternatif = (alt) => {
        setAlt(alt);
        setDeleteAlternatifDialog(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-text p-button-plain p-mr-2" 
                    onClick={() => editAlternatif(rowData)} />
                <Button 
                    icon="pi pi-times" 
                    className="p-button-rounded p-button-text p-button-plain" 
                    onClick={() => confirmDeleteAlternatif(rowData)} />
            </React.Fragment>
        )
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < alternatif.length; i++) {
            if (alternatif[i].id === id) {
                index = i;
                break;
            } 
        }
        return index;
    }

    const saveAlternatif = async () => {
        try {
            setSubmitted(true)
            if (alt.nama_alternatif.trim()) {
                if (insertMode) {
                    const response = await createAlternatif(alt);
                    const data = response.data;
                    const _alternatif = [...alternatif];
                    _alternatif.push(data);
                    setAlternatif(_alternatif);
                } else {
                    const response = await updateAlternatif(alt)
                    const data = response.data
                    const _alternatif = [...alternatif]
                    const index = findIndexById(data.id)
                    _alternatif[index] = data
                    setAlternatif(_alternatif)
                }
                setInsertMode(false)
                setAlternatifDialog(false)
                setAlt(emptyAlternatif)
                setSubmitted(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteAlternatif = async () => {
        try {
            await deleteAlternatifById(alt.id)
            let _alternatif = alternatif.filter(val => val.id !== alt.id)
            setAlternatif(_alternatif)
            setDeleteAlternatifDialog(false)
            setAlt(emptyAlternatif)
        } catch (error) {
            console.error(error)
        }
    }

    const alternatifDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Simpan Alternatif" icon="pi pi-check" className="p-button-text" onClick={saveAlternatif}/>
        </React.Fragment>
    )

    const deleteAlternatifDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog}/>
            <Button label="Hapus Alternatif" icon="pi pi-check" className="p-button-text" onClick={deleteAlternatif}/>
        </React.Fragment>
    )

    return (
        <MainPage>
            <div className='main-content'>
                <div className='content'>
                    <div className="content-inner">
                        <div className="content-header">
                            <h2>Alternatif</h2>
                            <div className="p-d-inline">
                                <Button label="Tambah" icon="pi pi-plus" className="p-mr-2" onClick={openNew} />
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="content-data shadow-1">
                                <DataTable value={alternatif} size="small" className="table-view" stripedRows>
                                    <Column field="nama_alternatif" header="Nama Alternatif"></Column>
                                    <Column field="deskripsi" header="Deskripsi"></Column>
                                    <Column body={actionBodyTemplate} style={{width: "120px", textAlign: "right"}}></Column>
                                </DataTable>
                                {/* {console.log(alternatif.length)} */}
                            </div>
                        </div>

                        <Dialog 
                            visible={alternatifDialog} 
                            style={{width: "500px"}} 
                            header="Alternatif" 
                            modal 
                            className="p-fluid" 
                            onHide={hideDialog} 
                            footer={alternatifDialogFooter}>
                            <div className="p-field">
                                <label htmlFor="nama_alternatif">Nama Alternatif</label>
                                <InputText id="nama_alternatif" value={alt.nama_alternatif} 
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _alt = {...alt};
                                    _alt.nama_alternatif = val;
                                    setAlt(_alt);
                                }} />
                                {submitted && !alt.nama_alternatif && <small className="p-error">Nama Alternatif harus diisi</small>}
                            </div>
                            <div className="p-field">
                                <label htmlFor="deskripsi">Deskripsi</label>
                                <InputText id="deskripsi" value={alt.deskripsi} 
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _alt = {...alt};
                                    _alt.deskripsi = val;
                                    setAlt(_alt);
                                }} />
                                {submitted && !alt.deskripsi && <small className="p-error">Deskripsi harus diisi</small>}
                            </div>
                        </Dialog>

                        <Dialog 
                            visible={deleteAlternatifDialog}
                            style={{ width: "500px" }}
                            header="Konfirmasi"
                            modal
                            footer={deleteAlternatifDialogFooter}
                            onHide={hideDeleteDialog}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle p-mr-3"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                                <br/>
                                <br/>
                                {alt && <span>Apakah anda yakin akan menghapus alternatif <b>{alt.nama_alternatif}</b>?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default AlternatifAdminPage;