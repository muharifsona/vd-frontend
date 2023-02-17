import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { findAllAlternatif } from "../../services/AlternatifService";
import { findAllKriteria } from "../../services/KriteriaService";
import { findAllAlternatifKriteria } from "../../services/AlternatifKriteriaService";

const VikorAdminPage = () => {

    const [alt, setAlt] = useState([]);
    const [krit, setKrit] = useState([]);
    const [ak, setAk] = useState([]);

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
        { 
            label: "Extremely good (EG)/extremely high (EH)",
            value: 10
        }, 
        { 
            label: "Very very good (VVG)/very very high (VVH)" ,
            value: 9
        }, 
        { 
            label: "Very good (VG)/very high (VH)" ,
            value: 8
        }, 
        { 
            label: "Good (G)/high (H)" ,
            value: 7
        }, 
        { 
            label: "Medium good (MG)/medium high (MH)" ,
            value: 6
        }, 
        { 
            label: "Fair (F)/medium (M)" ,
            value: 5
        }, 
        { 
            label: "Medium bad (MB)/medium low (ML)" ,
            value: 4
        }, 
        { 
            label: "Bad (B)/low (L)" ,
            value: 3
        }, 
        { 
            label: "Very bad (VB)/very low (VL)" ,
            value: 2
        }, 
        { 
            label: "Very very bad (VVB)/very very low (VVL)" ,
            value: 1
        }, 
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

    const minMax = []
    let nl = []
    for (let j = 0; j < krit.length; j++) {
        const n = []
        for (let k = 0; k < ak.length; k++) {
            if (ak[k].kriteria.id===krit[j].id) {
                n.push(parseFloat(ak[k].nilai))
            }
        }
        minMax[krit[j].id] = n
        nl[krit[j].id] = minMax[krit[j].id].sort(function(a, b) {
            if( a === Infinity ) 
                return 1; 
            else if( isNaN(a)) 
                return -1;
            else 
                return a - b;
        });
    }
    
    const matNorm = []
    for (let i = 0; i < alt.length; i++) {
        const norm = []
        for (let j = 0; j < krit.length; j++) {
            if (krit[j].costbenefit==="cost") {
                norm[krit[j].id] = (matNilai[alt[i].id][krit[j].id]-nl[krit[j].id][0])/(nl[krit[j].id][alt.length-1]-nl[krit[j].id][0])
            } else {
                norm[krit[j].id] = (nl[krit[j].id][alt.length-1]-matNilai[alt[i].id][krit[j].id])/(nl[krit[j].id][alt.length-1]-nl[krit[j].id][0])
            }
        }
        matNorm[alt[i].id] = norm
    }

    const matWNorm = []
    for (let i = 0; i < alt.length; i++) {
        const normalisasiterbobot = []
        for (let j = 0; j < krit.length; j++) {
            normalisasiterbobot[krit[j].id] = matNorm[alt[i].id][krit[j].id] * krit[j].bobot_kriteria
        }
        matWNorm[alt[i].id] = normalisasiterbobot
    }

    const si = []
    for (let i = 0; i < alt.length; i++) {
        si[alt[i].id] = matWNorm[alt[i].id].reduce((partialSum, a) => partialSum + a, 0);
    }

    const ri = []
    for (let i = 0; i < alt.length; i++) {
        ri[alt[i].id] = matWNorm[alt[i].id].reduce((a, b) => Math.max(a, b), -Infinity)
    }
    
    const v = 0.5
    const maxSi = si.reduce((a, b) => Math.max(a, b), -Infinity)
    const maxRi = ri.reduce((a, b) => Math.max(a, b), -Infinity)
    const minSi = si.reduce((a, b) => Math.min(a, b), Infinity)
    const minRi = ri.reduce((a, b) => Math.min(a, b), Infinity)

    let rank = []
    let sortedrank = []
    for (let i = 0; i < alt.length; i++) {
        rank[alt[i].id] = (v*((si[alt[i].id]-(minSi))/((maxSi)-(minSi))))+((1-v)*((ri[alt[i].id]-(minRi))/((maxRi)-(minRi))))
        sortedrank[alt[i].id] = rank.sort()
    }

    // console.log(si);
    // console.log(ri);
    // console.log(namaKrit);
    
    return (
        <MainPage>
            <div className='main-content'>
                <div className='content'>
                    <div className="content-inner">
                        <div className="content-header">
                            <h2>Alternatif Kriteria</h2>
                            <div className="p-d-inline">
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="content-data shadow-1">
                                <div className="table-responsive">
                                    <hr />
                                    Linguistik
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
                                                return <td> {linguis[parseInt(subItems)]} </td>;
                                                })}
                                            </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                        
                                </div>
                                <div className="table-responsive">
                                    <hr />
                                    Nilai
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
                                                return <td> {subItems} </td>;
                                                })}
                                            </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                        
                                </div>
                                <div className="table-responsive">
                                    <hr />
                                    Normalisasi
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
                                    {matNorm.map((items, index) => {
                                        return (
                                        <tr key={index}>
                                            <td> {namaAlt[index]} </td>
                                            {items.map((subItems, sIndex) => {
                                            return <td> {subItems} </td>;
                                            })}
                                        </tr>
                                        );
                                    })}
                                        </tbody>
                                    </table>
                                        
                                </div>
                                <div className="table-responsive">
                                    <hr />
                                    Normalisasi Terbobot
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                        <tr>
                                            <td>Nama Alternatif</td>
                                            {namaKrit.map((items, index) => {
                                                return (
                                                <td> { items } </td>
                                                )
                                            })}
                                            <td>Si</td>
                                            <td>Ri</td>
                                        </tr>
                                        {matWNorm.map((items, index) => {
                                        return (
                                        <tr key={index}>
                                            <td> {namaAlt[index]} </td>
                                            {items.map((subItems, sIndex) => {
                                            return <td> {subItems} </td>;
                                            })}
                                            <td> {si[index]} </td>
                                            <td> {ri[index]} </td>
                                        </tr>
                                        );
                                        })}
                                        <tr>
                                            <td colSpan={krit.length+1}>Maximum</td>
                                            <td> { maxSi } </td>
                                            <td> { maxRi } </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={krit.length+1}>Minimum</td>
                                            <td> { minSi } </td>
                                            <td> { minRi } </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={krit.length+1}>v (constant)</td>
                                            <td>{v}</td>
                                            <td></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                        
                                </div>
                                <div className="table-responsive">
                                    <hr />
                                    Ranking
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                                
                                        {rank.map((items, index) => {
                                            return (
                                            <tr key={index}>
                                                <td> {namaAlt1[index]} </td>
                                                <td> {items} </td>
                                            </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default VikorAdminPage;