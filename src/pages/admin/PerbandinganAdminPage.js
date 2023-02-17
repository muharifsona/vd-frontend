import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { findAllKriteria } from "../../services/KriteriaService";
import { createPerbandingan, deletePerbandinganById, findAllPerbandingan, updatePerbandingan } from "../../services/PerbandinganService";

const PerbandinganAdminPage = () => {

    const [krit, setKrit] = useState([]);
    const [perb, setPerb] = useState([]);

    const [perbDialog, setPerbDialog] = useState(false)
    const [deletePerbDialog, setDeletePerbDialog] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [insertMode, setInsertMode] = useState(false)
    
    const emptyPerb = {
        id_perbandingan: "",
        dematel_scale: ""
    }

    const [per, setPer] = useState(emptyPerb);

    useEffect(() => {

        loadKrit()
        loadPerb()

    }, [])

    const loadKrit = async () => {
        try {
            const response = await findAllKriteria()
            setKrit(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    const loadPerb = async () => {
        try {
            const response = await findAllPerbandingan()
            setPerb(response.data)

        } catch (error) {
            console.error(error)
        }
    }

    const namaKrit = []
    for (let i = 0; i < krit.length; i++) {
        namaKrit[i] = krit[i].nama_kriteria
    }

    const idKrit = []
    for (let i = 0; i < krit.length; i++) {
        idKrit[i] = i
    }

    const arr_dematel_scale1 = [
        { label: "No Influence", value: "0.00" }, //No Influence
        { label: "Low Influence", value: "0.35" }, //Low Influence
        { label: "Medium Influence", value: "0.50" }, //Medium Influence
        { label: "High Influence", value: "0.75" }, //High Influence
        { label: "Very High Influence", value: "0.90" } //Very High Influence
        ] ;
    
    const arr_dematel_scale2 = [
        { label: "No Influence", value: "1.00" }, //No Influence
        { label: "Low Influence", value: "0.60" }, //Low Influence
        { label: "Medium Influence", value: "0.45" }, //Medium Influence
        { label: "High Influence", value: "0.20" }, //High Influence
        { label: "Very High Influence", value: "0.10" } //Very High Influence
        ] ;
    
    const arr_dematel_scale3 = [
        { label: "No Influence", value: "0.00"}, //No Influence
        { label: "Low Influence", value: "0.05"}, //Low Influence
        { label: "Medium Influence", value: "0.05"}, //Medium Influence
        { label: "High Influence", value: "0.05"}, //High Influence
        { label: "Very High Influence", value: "0.00"} //Very High Influence
        ] ;
    
    const linguis_dm2 = []
    for (let i = 0; i < arr_dematel_scale2.length; i++) {
        linguis_dm2[arr_dematel_scale2[i].value] = arr_dematel_scale2[i].label
    }
    
    const linguis_dm1 = []
    for (let i = 0; i < arr_dematel_scale1.length; i++) {
        linguis_dm1[arr_dematel_scale1[i].value] = arr_dematel_scale1[i].label
    }
    
    const linguis_dm3 = []
    for (let i = 0; i < arr_dematel_scale3.length; i++) {
        linguis_dm3[arr_dematel_scale3[i].value] = arr_dematel_scale3[i].label
    }
        
    const dm = [
        0.406175771971496,
        0.356294536817102,
        0.237529691211401
    ]

    const kriteria = []
    for (let i = 0; i < krit.length; i++) {
        kriteria[i] = i
    } 

    const perbo = []
    for (let i = 0; i < perb.length; i++) {
        perbo[perb[i].id_perbandingan] = perb[i].dematel_scale
    } 

    const perbandingan = []
    for (let i = 0; i < krit.length; i++) {

        const perbandinganI = []
        for (let j = 0; j < dm.length; j++) {

            const perbandinganJ = []
            for (let k = 0; k < krit.length; k++) {

                const perbandinganK = []
                for (let l = 0; l < 3; l++) {

                    perbandinganK[l] = 0.00
                    for (let m = 0; m < perb.length; m++) {
                        if (perb[m].id_perbandingan === `dm${j+1}${l+1}${krit[i].id}${krit[k].id}`) {
                            perbandinganK[l] = perb[m].dematel_scale
                            // perbandinganK[l] = parseFloat(perb[m].dematel_scale)
                        }
                    }
                    
                }

                perbandinganJ[k] = perbandinganK
            }

            perbandinganI[j] = perbandinganJ
        }

        perbandingan[i] = perbandinganI
    }

    const hideDialog = () => {
        setPerbDialog(false)
        setSubmitted(false)
    }

    const hideDeleteDialog = () => {
        setDeletePerbDialog(false)
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < perb.length; i++) {
            if (perb[i].id_perbandingan === id) {
                index = i;
                break;
            } 
        }
        return index;
    }

    const editPerb = (d ,e) => {
        setInsertMode(true)
        setSubmitted(false)
        setPer({
            id_perbandingan: `${d}`,
            dematel_scale: `${e}`
        })
        setPerbDialog(true)
    }

    const savePerb = async () => {
        try {
            setSubmitted(true)
            if (per.dematel_scale.trim()) {
                if (insertMode) {
                    const idperb = per.id_perbandingan
                    await deletePerbandinganById(idperb)
                    if (idperb!==-1) {
                    }
                    const response = await createPerbandingan(per)
                    const data = response.data
                    const _perb = [...perb]
                    _perb.push(data)
                    setPerb(_perb)
                } else {
                    const response = await updatePerbandingan(per)
                    const data = response.data
                    const _perb = [...perb]
                    const index = findIndexById(data.id_perbandingan)
                    _perb[index] = data
                    setPerb(_perb)
                }
                setInsertMode(false)
                setPerbDialog(false)
                setPer(emptyPerb)
                setSubmitted(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const deletePerb = async () => {
        try {
            await deletePerbandinganById(per.id_perbandingan)
            let _perb = perb.filter(val => val.id_perbandingan !== per.id_perbandingan)
            setPerb(_perb)
            setDeletePerbDialog(false)
            setPer(emptyPerb)
        } catch (error) {
            console.error(error)
        }
    }

    const perbDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Simpan Perbandingan" icon="pi pi-check" className="p-button-text" onClick={savePerb}/>
        </React.Fragment>
    )

    const deletePerbDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog}/>
            <Button label="Hapus Perbandingan" icon="pi pi-check" className="p-button-text" onClick={deletePerb}/>
        </React.Fragment>
    )

    return (
        <MainPage>
            <div className='main-content'>
                <div className='content'>
                    <div className="content-inner">
                        <div className="content-header">
                            <h2>DEMATEL</h2>
                            <div className="p-d-inline">
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="content-data shadow-1">
                                <div className="table-responsive">
                                    <hr />
                                    Hasil Kuesioner ke Dematel Scale
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                            <tr>
                                                <td>Kriteria</td>
                                                {dm.map((d, id) => {
                                                    return(
                                                    krit.map((k, ik) => {
                                                        return (
                                                            <td key={ik} colSpan="3">C {ik+1}</td>
                                                        )
                                                    }))
                                                })}
                                            </tr>
                                            {perbandingan.map((itemI, indexI) => {
                                                return (
                                                <tr key={indexI}>
                                                    
                                                    <td> {namaKrit[indexI]} </td>

                                                    {itemI.map((itemJ, indexJ) => {
                                                        return (
                                                            itemJ.map((itemK, indexK) => {
                                                                return (
                                                                    itemK.map((itemL, indexL) => {
                                                                    return (
                                                                    
                                                                    <td key={indexL}> 
                                                                        {/* {itemL} */}
                                                                        {/* <br/> {indexJ}{indexL}{indexI}{indexK}  */}
                                                                        {/* {perbandingan['dm'+(indexL+1)][krit[indexK].id][indexJ+1][krit[indexI].id]} */}
                                                                        <Button 
                                                                            className="p-button-rounded p-button-text p-button-plain p-mr-2" 
                                                                            onClick={() => editPerb('dm'+(indexJ+1)+[indexL+1]+krit[indexI].id+krit[indexK].id, itemL)}>
                                                                                {/* {itemL} */}
                                                                                { indexL === 0 ? linguis_dm1[itemL] : "" }
                                                                                { indexL === 1 ? linguis_dm2[itemL] : "" }
                                                                                { indexL === 2 ? linguis_dm3[itemL] : "" }
                                                                        </Button>
                                                                    </td>

                                                                    )})

                                                                )
                                                            })
                                                        )
                                                    })}

                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                        
                                </div>
                            </div>
                            <Dialog 
                                visible={perbDialog} 
                                style={{width: "500px"}} 
                                header="Perbandingan Dematel Scale" 
                                modal 
                                className="p-fluid" 
                                onHide={hideDialog} 
                                footer={perbDialogFooter}>
                                <div className="p-field">
                                    <label htmlFor="id_perbandingan">ID Perbandingan</label>
                                    <InputText 
                                        id="id_perbandingan" 
                                        value={per.id_perbandingan} 
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _per = {...per};
                                            _per.id_perbandingan = val;
                                            setPer(_per);
                                    }} />
                                    {submitted && !per.id_perbandingan && <small className="p-error">ID Perbandingan harus diisi</small>}
                                </div>
                                <div className="p-field">
                                    <label htmlFor="dematel_scale">Dematel Scale</label>
                                    {/* <InputText 
                                        id="dematel_scale" 
                                        value={per.dematel_scale} 
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _per = {...per};
                                            _per.dematel_scale = val;
                                            setPer(_per);
                                    }} /> */}
                                    { per.id_perbandingan.includes("dm11") || per.id_perbandingan.includes("dm21") || per.id_perbandingan.includes("dm31") ?
                                    (<Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        id="dematel_scale" 
                                        value={per.dematel_scale}
                                        options={arr_dematel_scale1}
                                        placeholder="Pilih Nilai"
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _per = {...per};
                                            _per.dematel_scale = val;
                                            setPer(_per);
                                        }}
                                    />) : "" 
                                    }
                                    { per.id_perbandingan.includes("dm12") || per.id_perbandingan.includes("dm22") || per.id_perbandingan.includes("dm32") ?
                                    (<Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        id="dematel_scale" 
                                        value={per.dematel_scale}
                                        options={arr_dematel_scale2}
                                        placeholder="Pilih Nilai"
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _per = {...per};
                                            _per.dematel_scale = val;
                                            setPer(_per);
                                        }}
                                    />) : "" 
                                    }
                                    { per.id_perbandingan.includes("dm13") || per.id_perbandingan.includes("dm23") || per.id_perbandingan.includes("dm33") ?
                                    (<Dropdown
                                        optionLabel="label"
                                        optionValue="value"
                                        id="dematel_scale" 
                                        value={per.dematel_scale}
                                        options={arr_dematel_scale3}
                                        placeholder="Pilih Nilai"
                                        onChange={(e) => {
                                            const val = (e.target && e.target.value) || '';
                                            const _per = {...per};
                                            _per.dematel_scale = val;
                                            setPer(_per);
                                        }}
                                    />) : "" 
                                    }
                                    {submitted && !per.dematel_scale && <small className="p-error">Dematel Scale harus diisi</small>}
                                </div>
                            </Dialog>

                            <Dialog 
                                visible={deletePerbDialog}
                                style={{ width: "500px" }}
                                header="Konfirmasi"
                                modal
                                footer={deletePerbDialogFooter}
                                onHide={hideDeleteDialog}>
                                <div className="confirmation-content">
                                    <i className="pi pi-exclamation-triangle p-mr-3"
                                        style={{ fontSize: "2rem" }}
                                    ></i>
                                    <br/>
                                    <br/>
                                    {krit && <span>Apakah anda yakin akan menghapus perbandingan <b>{per.id_perbandingan}</b>?</span>}
                                </div>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default PerbandinganAdminPage;