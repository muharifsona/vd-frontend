import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { createKriteria, deleteKriteriaById, findAllKriteria, updateKriteria } from "../../services/KriteriaService";
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const KriteriaAdminPage = () => {

    const [kriteria, setKriteria] = useState([]);
    const [kriteriaDialog, setKriteriaDialog] = useState(false)
    const [deleteKriteriaDialog, setDeleteKriteriaDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [insertMode, setInsertMode] = useState(false)
    
    const emptyKriteria = {
        id: null,
        nama_kriteria: "",
        costbenefit: "",
        bobot_kriteria: ""
    }
    const [krit, setKrit] = useState(emptyKriteria);

    useEffect(() => {

        load()

    }, [])

    const load = async () => {
        try {
            const response = await findAllKriteria()
            setKriteria(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    // const test = () => {
    //     for (let i = 0; i < kriteria.length; i++) {
    //         console.log(kriteria[i].bobot_kriteria*2)
    //     }
    // }

    // test();

    const openNew = () => {
        setKrit(emptyKriteria)
        setInsertMode(true)
        setKriteriaDialog(true)
        setSubmitted(false)
    }

    const hideDialog = () => {
        setKriteriaDialog(false)
        setSubmitted(false)
    }

    const hideDeleteDialog = () => {
        setDeleteKriteriaDialog(false)
    }

    const editKriteria = (krit) => {
        setInsertMode(false)
        setSubmitted(false)
        setKrit({...krit})
        setKriteriaDialog(true)
    }

    const confirmDeleteKriteria = (krit) => {
        setKrit(krit);
        setDeleteKriteriaDialog(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-text p-button-plain p-mr-2" 
                    onClick={() => editKriteria(rowData)} />
                <Button icon="pi pi-times" className="p-button-rounded p-button-text p-button-plain" onClick={() => confirmDeleteKriteria(rowData)} />
            </React.Fragment>
        )
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < kriteria.length; i++) {
            if (kriteria[i].id === id) {
                index = i;
                break;
            } 
        }
        return index;
    }

    const saveKriteria = async () => {
        try {
            setSubmitted(true)
            if (krit.nama_kriteria.trim()) {
                if (insertMode) {
                    const response = await createKriteria(krit);
                    const data = response.data;
                    const _kriteria = [...kriteria];
                    _kriteria.push(data);
                    setKriteria(_kriteria);
                } else {
                    const response = await updateKriteria(krit)
                    const data = response.data
                    const _kriteria = [...kriteria]
                    const index = findIndexById(data.id)
                    _kriteria[index] = data
                    setKriteria(_kriteria)
                }
                setInsertMode(false)
                setKriteriaDialog(false)
                setKrit(emptyKriteria)
                setSubmitted(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteKriteria = async () => {
        try {
            await deleteKriteriaById(krit.id)
            let _kriteria = kriteria.filter(val => val.id !== krit.id)
            setKriteria(_kriteria)
            setDeleteKriteriaDialog(false)
            setKrit(emptyKriteria)
        } catch (error) {
            console.error(error)
        }
    }

    const kriteriaDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Simpan Kriteria" icon="pi pi-check" className="p-button-text" onClick={saveKriteria}/>
        </React.Fragment>
    )

    const deleteKriteriaDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog}/>
            <Button label="Hapus Kriteria" icon="pi pi-check" className="p-button-text" onClick={deleteKriteria}/>
        </React.Fragment>
    )

    return (
        <MainPage>
            <div className='main-content'>
                <div className='content'>
                    <div className="content-inner">
                        <div className="content-header">
                            <h2>Kriteria</h2>
                            <div className="p-d-inline">
                                <Button label="Tambah" icon="pi pi-plus" className="p-mr-2" onClick={openNew} />
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="content-data shadow-1">
                                <DataTable value={kriteria} size="small" className="table-view" stripedRows>
                                    <Column field="nama_kriteria" header="Nama Kriteria"></Column>
                                    <Column field="costbenefit" header="Cost/Benefit"></Column>
                                    <Column field="bobot_kriteria" header="Bobot Kriteria"></Column>
                                    <Column body={actionBodyTemplate} style={{width: "120px", textAlign: "right"}}></Column>
                                </DataTable>
                                {/* {console.log(kriteria.length)} */}
                            </div>
                        </div>

                        <Dialog 
                            visible={kriteriaDialog} 
                            style={{width: "500px"}} 
                            header="Kriteria" 
                            modal 
                            className="p-fluid" 
                            onHide={hideDialog} 
                            footer={kriteriaDialogFooter}>
                            <div className="p-field">
                                <label htmlFor="nama_kriteria">Nama Kriteria</label>
                                <InputText id="nama_kriteria" value={krit.nama_kriteria} 
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _krit = {...krit};
                                    _krit.nama_kriteria = val;
                                    setKrit(_krit);
                                }} />
                                {submitted && !krit.nama_kriteria && <small className="p-error">Nama Kriteria harus diisi</small>}
                            </div>
                            <div className="p-field">
                                <label htmlFor="costbenefit">Cost / Benefit</label>
                                <InputText id="costbenefit" value={krit.costbenefit} 
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _krit = {...krit};
                                    _krit.costbenefit = val;
                                    setKrit(_krit);
                                }} />
                                {submitted && !krit.costbenefit && <small className="p-error">Cost / Benefit harus diisi</small>}
                            </div>
                            <div className="p-field">
                                <label htmlFor="bobot_kriteria">Bobot Kriteria</label>
                                <InputText id="bobot_kriteria" value={krit.bobot_kriteria} 
                                onChange={(e) => {
                                    const val = (e.target && e.target.value) || '';
                                    const _krit = {...krit};
                                    _krit.bobot_kriteria = val;
                                    setKrit(_krit);
                                }} />
                                {submitted && !krit.bobot_kriteria && <small className="p-error">Bobot Kriteria harus diisi</small>}
                            </div>
                        </Dialog>

                        <Dialog 
                            visible={deleteKriteriaDialog}
                            style={{ width: "500px" }}
                            header="Konfirmasi"
                            modal
                            footer={deleteKriteriaDialogFooter}
                            onHide={hideDeleteDialog}>
                            <div className="confirmation-content">
                                <i className="pi pi-exclamation-triangle p-mr-3"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                                <br/>
                                <br/>
                                {krit && <span>Apakah anda yakin akan menghapus kriteria <b>{krit.nama_kriteria}</b>?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default KriteriaAdminPage;