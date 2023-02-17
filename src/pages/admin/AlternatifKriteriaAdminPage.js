import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { findAllAlternatif } from "../../services/AlternatifService";
import { findAllKriteria } from "../../services/KriteriaService";
import { createAlternatifKriteria, deleteAlternatifKriteriaById, findAllAlternatifKriteria, updateAlternatifKriteria } from "../../services/AlternatifKriteriaService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const AlternatifKriteriaAdminPage = () => {

    const [alt, setAlt] = useState([]);
    const [krit, setKrit] = useState([]);
    const [ak, setAk] = useState([]);

    const [akDialog, setAkDialog] = useState(false)
    const [deleteAkDialog, setDeleteAkDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [insertMode, setInsertMode] = useState(false)
    
    const emptyAk = {
        id: null,
        alternatif: {
            id: "",
            nama_alternatif: "",
            deskripsi: ""
        },
        kriteria: {
            id: "",
            nama_kriteria: "",
            costbenefit: "",
            bobot_kriteria: "",
        },
        nilai: ""
    }

    const [a, setA] = useState(emptyAk);

    useEffect(() => {

        loadAlt()
        loadKrit()
        loadAk()

    }, [])

    const loadAlt = async () => {
        try {
            const response = await findAllAlternatif()
            setAlt(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    const loadKrit = async () => {
        try {
            const response = await findAllKriteria()
            setKrit(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    const loadAk = async () => {
        try {
            const response = await findAllAlternatifKriteria()
            setAk(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    const linguistik = [
        { label: "Extremely good (EG)/extremely high (EH)", value: 10 }, 
        { label: "Very very good (VVG)/very very high (VVH)", value: 9 }, 
        { label: "Very good (VG)/very high (VH)", value: 8 }, 
        { label: "Good (G)/high (H)", value: 7 }, 
        { label: "Medium good (MG)/medium high (MH)", value: 6 }, 
        { label: "Fair (F)/medium (M)", value: 5 }, 
        { label: "Medium bad (MB)/medium low (ML)", value: 4 }, 
        { label: "Bad (B)/low (L)", value: 3 }, 
        { label: "Very bad (VB)/very low (VL)", value: 2 }, 
        { label: "Very very bad (VVB)/very very low (VVL)", value: 1 }, 
    ];
    
    const linguis = []
    for (let i = 0; i < linguistik.length; i++) {
        linguis[linguistik[i].value] = linguistik[i].label
    }

    const namaKrit = []
    for (let i = 0; i < krit.length; i++) {
        namaKrit[krit[i].id] = krit[i].nama_kriteria
    }

    const namaAlt = []
    for (let i = 0; i < alt.length; i++) {
        namaAlt[alt[i].id] = alt[i].nama_alternatif
    }

    const namaAlt1 = []
    for (let i = 0; i < alt.length; i++) {
        namaAlt1[i] = alt[i].nama_alternatif
    }

    const matNilai = []
    for (let i = 0; i < alt.length; i++) {
        const nilai = []
        for (let j = 0; j < krit.length; j++) {
            nilai[krit[j].id] = 0
            for (let k = 0; k < ak.length; k++) {
                if (ak[k].alternatif.id===alt[i].id && ak[k].kriteria.id===krit[j].id) {
                    nilai[krit[j].id] = ak[k].nilai
                }
            }
        }
        matNilai[alt[i].id] = nilai
    }

    const hideDialog = () => {
        setAkDialog(false)
        setSubmitted(false)
    }

    const hideDeleteDialog = () => {
        setDeleteAkDialog(false)
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < ak.length; i++) {
            if (ak[i].id === id) {
                index = i;
                break;
            } 
        }
        return index;
    }

    const findIdByIdAltIdKrit = (idalt, idkrit) => {
        let index = -1;
        for (let i = 0; i < ak.length; i++) {
            if (ak[i].alternatif.id === idalt && ak[i].kriteria.id === idkrit) {
                index = ak[i].id;
                break;
            } 
        }
        return index;
    }

    const editAk = (q, w, e) => {
        setInsertMode(true)
        setSubmitted(false)
        setA({
            id: "",
            alternatif: {
                id: `${q}`,
            },
            kriteria: {
                id: `${w}`,
            },
            nilai: `${e}`
        })
        setAkDialog(true)
    }

    const saveAk = async () => {
        try {
            setSubmitted(true)
            if (a.alternatif.id.trim()) {
                if (insertMode) {
                    const idak = findIdByIdAltIdKrit(a.alternatif.id, a.kriteria.id)
                    if (idak!==-1) {
                        await deleteAlternatifKriteriaById(idak)
                    }
                    const response = await createAlternatifKriteria(a)
                    const data = response.data
                    const _ak = [...ak]
                    _ak.push(data)
                    setAk(_ak)
                } else {
                    const response = await updateAlternatifKriteria(a)
                    const data = response.data
                    const _ak = [...ak]
                    const index = findIndexById(data.id)
                    _ak[index] = data
                    setAk(_ak)
                }
                setInsertMode(false)
                setAkDialog(false)
                setA(emptyAk)
                setSubmitted(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deleteAk = async () => {
        try {
            await deleteAlternatifKriteriaById(a.id)
            let _ak = ak.filter(val => val.id !== a.id)
            setAk(_ak)
            setDeleteAkDialog(false)
            setA(emptyAk)
        } catch (error) {
            console.error(error)
        }
    }

    const akDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Simpan Alternatif Kriteria" icon="pi pi-check" className="p-button-text" onClick={saveAk}/>
        </React.Fragment>
    )

    const deleteAkDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog}/>
            <Button label="Hapus Alternatif Kriteria" icon="pi pi-check" className="p-button-text" onClick={deleteAk}/>
        </React.Fragment>
    )
    
    console.log(linguis)
    // console.log(linguistik)
    
    return (
        <MainPage>
            <div className='main-content'>
                <div className='content'>
                    <div className="content-inner">
                        <div className="content-header">
                            <h2>Alternatif Kriteria</h2>
                            <div className="p-d-inline">
                                {/* <Button label="Tambah" icon="pi pi-plus" className="p-mr-2" onClick={openNew} /> */}
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="content-data shadow-1">
                                <div className="table-responsive">
                                    <hr />
                                    *Klik pada kolom nilai untuk mengubah nilai
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                            <tr>
                                                <td>Nama Alternatif</td>
                                                {namaKrit.map((items, index) => {
                                                    return (
                                                    <td> { items } </td>
                                                    )
                                                })}
                                            </tr>
                                            {matNilai.map((items, index) => {
                                            return (
                                            <tr key={index}>
                                                <td> {namaAlt[index]} </td>
                                                {items.map((subItems, sIndex) => {
                                                return (
                                                    <td> 
                                                        <Button 
                                                        className="p-button-rounded p-button-text p-button-plain p-mr-2" 
                                                        onClick={() => editAk(index, sIndex, subItems)}>
                                                            {linguis[parseInt(subItems)]}
                                                        </Button>
                                                    </td>   
                                                )})}
                                            </tr>
                                            );
                                            })}
                                        </tbody>
                                    </table>        
                                </div>
                            </div>
                            <Dialog 
                                visible={akDialog} 
                                style={{width: "500px"}} 
                                header="Alternatif Kriteria" 
                                modal 
                                className="p-fluid" 
                                onHide={hideDialog} 
                                footer={akDialogFooter}>
                                <div className="p-field">
                                    <label htmlFor="kriteria">Kriteria</label>
                                    <Dropdown
                                        optionLabel="nama_kriteria"
                                        optionValue="id"
                                        id="kriteria"
                                        value={a.kriteria.id}
                                        options={krit}
                                        placeholder="Pilih kriteria"
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || null
                                            const _a = {...a}
                                            _a.kriteria.id = val
                                            setA(_a)
                                        }}
                                    />
                                    {submitted && !a.kriteria.id && <small className="p-error">Kriteria harus dipilih</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="alternatif">Alternatif</label>
                                    <Dropdown
                                        optionLabel="nama_alternatif"
                                        optionValue="id"
                                        id="alternatif"
                                        value={a.alternatif.id}
                                        options={alt}
                                        placeholder="Pilih alternatif"
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || null
                                            const _a = {...a}
                                            _a.alternatif.id = val
                                            setA(_a)
                                        }}
                                    />
                                    {submitted && !a.alternatif.id && <small className="p-error">Alternatif harus dipilih</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="nilai">Nilai</label>
                                    <Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        id="nilai" 
                                        value={parseInt(a.nilai)}
                                        options={linguistik}
                                        placeholder="Pilih Nilai"
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _a = {...a};
                                            _a.nilai = val;
                                            setA(_a);
                                        }}
                                    />
                                    {submitted && !a.nilai && <small className="p-error">Nilai harus dipilih</small>}
                                </div>
                                {/* <div className="p-field">
                                    <label htmlFor="nilai">Nilai</label>
                                    <InputText 
                                        id="nilai" 
                                        value={a.nilai}
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _a = {...a};
                                            _a.nilai = val;
                                            setA(_a);
                                    }} />
                                    {submitted && !a.nilai && <small className="p-error">Nilai harus diisi</small>}
                                </div> */}
                            </Dialog>

                            <Dialog 
                                visible={deleteAkDialog}
                                style={{ width: "500px" }}
                                header="Konfirmasi"
                                modal
                                footer={deleteAkDialogFooter}
                                onHide={hideDeleteDialog}>
                                <div className="confirmation-content">
                                    <i className="pi pi-exclamation-triangle p-mr-3"
                                        style={{ fontSize: "2rem" }}
                                    ></i>
                                    <br/>
                                    <br/>
                                    {krit && <span>Apakah anda yakin akan menghapus alternatif kriteria <b>{a.id}</b>?</span>}
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default AlternatifKriteriaAdminPage;