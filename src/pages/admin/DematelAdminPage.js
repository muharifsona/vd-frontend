import React, { useEffect, useState } from "react";
import MainPage from "../../component/MainPage";
import { findAllKriteria } from "../../services/KriteriaService";
import { findAllPerbandingan } from "../../services/PerbandinganService";

const DematelAdminPage = () => {

    const [krit, setKrit] = useState([]);
    const [perb, setPerb] = useState([]);

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

                    for (let m = 0; m < perb.length; m++) {
                        if (perb[m].id_perbandingan === `dm${j+1}${l+1}${krit[i].id}${krit[k].id}`) {
                            perbandinganK[l] = parseFloat(perb[m].dematel_scale)
                        }
                    }
                    
                }

                perbandinganJ[k] = perbandinganK
            }

            perbandinganI[j] = perbandinganJ
        }

        perbandingan[i] = perbandinganI
    }

    const agregate = []
    for (let i = 0; i < krit.length; i++) {

            const agregateJ = []
            for (let k = 0; k < krit.length; k++) {

                const agregateK = []
                for (let l = 0; l < 3; l++) {

                    if (l===0) {
                        agregateK[l] = 1-((Math.pow((1-perbandingan[i][0][k][l]), dm[0]))*(Math.pow((1-perbandingan[i][1][k][l]), dm[1]))*(Math.pow((1-perbandingan[i][2][k][l]), dm[2])))
                    } else if (l===1) {
                        agregateK[l] = Math.pow(perbandingan[i][0][k][l], dm[0])*Math.pow(perbandingan[i][1][k][l], dm[1])*Math.pow(perbandingan[i][2][k][l], dm[2])
                    } else if (l===2) {
                        agregateK[l] = 1-((Math.pow((1-perbandingan[i][0][k][l]), dm[0]))*(Math.pow((1-perbandingan[i][1][k][l]), dm[1]))*(Math.pow((1-perbandingan[i][2][k][l]), dm[2])))
                    }
                    // agregateK[l] = perbandingan[i][1][k][l]
                        
                }

                agregateJ[k] = agregateK
            }

        agregate[i] = agregateJ
    }

    const sumrow = []
    const normalisasi = []
    for (let i = 0; i < krit.length; i++) {

        const normalisasiJ = []
        for (let k = 0; k < krit.length; k++) {
            normalisasiJ[k] = Math.sqrt(Math.pow(agregate[i][k][0],2) + Math.pow(agregate[i][k][1],2) + Math.pow(agregate[i][k][2],2))
        }

        normalisasi[i] = normalisasiJ
        sumrow[i] = normalisasiJ.reduce((partialSum, a) => partialSum + a, 0)
    }
    
    const sumcol = []
    for (let i = 0; i < krit.length; i++) {
        sumcol[i] = normalisasi[i].reduce((partialSum, a) => partialSum + a, 0)
    }

    const maxsumcol = sumcol.reduce((a, b) => Math.max(a, b), -Infinity)  
    const maxsumrow = sumrow.reduce((a, b) => Math.max(a, b), -Infinity)  
    const arrmaxsum = [1/maxsumcol, 1/maxsumrow]
    const il = arrmaxsum.reduce((a, b) => Math.min(a, b), Infinity)
    
    const agregatenorm = []
    for (let i = 0; i < krit.length; i++) {

        const agregatenormJ = []
        for (let k = 0; k < krit.length; k++) {

            const agregatenormK = []
            for (let l = 0; l < 3; l++) {

                if (l===0) {
                    agregatenormK[l] = (1-((Math.pow((1-perbandingan[i][0][k][l]), dm[0]))*(Math.pow((1-perbandingan[i][1][k][l]), dm[1]))*(Math.pow((1-perbandingan[i][2][k][l]), dm[2])))) * il
                } else if (l===1) {
                    agregatenormK[l] = (Math.pow(perbandingan[i][0][k][l], dm[0])*Math.pow(perbandingan[i][1][k][l], dm[1])*Math.pow(perbandingan[i][2][k][l], dm[2])) * il
                } else if (l===2) {
                    agregatenormK[l] = (1-((Math.pow((1-perbandingan[i][0][k][l]), dm[0]))*(Math.pow((1-perbandingan[i][1][k][l]), dm[1]))*(Math.pow((1-perbandingan[i][2][k][l]), dm[2])))) * il
                }
                    
            }

            agregatenormJ[k] = agregatenormK
        }

        agregatenorm[i] = agregatenormJ
    }
    
    const agregatenorm1 = []
    for (let i = 0; i < krit.length; i++) {

        const agregatenorm1J = []
        for (let k = 0; k < krit.length; k++) {
            agregatenorm1J[k] = agregatenorm[i][k][0]
        }

        agregatenorm1[i] = agregatenorm1J
    }
    
    const agregatenorm2 = []
    for (let i = 0; i < krit.length; i++) {

        const agregatenorm2J = []
        for (let k = 0; k < krit.length; k++) {
            agregatenorm2J[k] = agregatenorm[i][k][1]
        }

        agregatenorm2[i] = agregatenorm2J
    }
    
    const agregatenorm3 = []
    for (let i = 0; i < krit.length; i++) {

        const agregatenorm3J = []
        for (let k = 0; k < krit.length; k++) {
            agregatenorm3J[k] = agregatenorm[i][k][2]
        }

        agregatenorm3[i] = agregatenorm3J
    }
    
    const defaultmat = []
    for (let i = 0; i < krit.length; i++) {
        defaultmat[i] = []
        for (let k = 0; k < krit.length; k++) {
            defaultmat[i].push(i===k ? 1 : 0)
        }
    }

    const subtracted1 = []
    for (let i = 0; i < krit.length; i++) {
        subtracted1[i] = []
        for (let j = 0; j < krit.length; j++) {
            subtracted1[i][j] = defaultmat[i][j] - agregatenorm1[i][j]
        }
    }

    const subtracted2 = []
    for (let i = 0; i < krit.length; i++) {
        subtracted2[i] = []
        for (let j = 0; j < krit.length; j++) {
            subtracted2[i][j] = defaultmat[i][j] - agregatenorm2[i][j]
        }
    }

    const subtracted3 = []
    for (let i = 0; i < krit.length; i++) {
        subtracted3[i] = []
        for (let j = 0; j < krit.length; j++) {
            subtracted3[i][j] = defaultmat[i][j] - agregatenorm3[i][j]
        }
    }

    const augmented1 = [] 
    for (let i = 0; i < krit.length; i++) {
        augmented1[i] = subtracted1[i].concat(defaultmat[i])
    }

    const augmented2 = [] 
    for (let i = 0; i < krit.length; i++) {
        augmented2[i] = subtracted2[i].concat(defaultmat[i])
    }

    const augmented3 = [] 
    for (let i = 0; i < krit.length; i++) {
        augmented3[i] = subtracted3[i].concat(defaultmat[i])
    }

    for (let i = 0; i < krit.length; i++) {
        if (augmented1[i][i] !== 1) {
            let divisor
            if (augmented1[i][i] === 0) {
                divisor = 0.0000000001
                augmented1[i][i] = 0.0000000001
            } else {
                divisor = augmented1[i][i]
            }
            for (let ix = 0; ix < 14; ix++) {
                augmented1[i][ix] = augmented1[i][ix] / divisor
            }
        }
        for (let j = 0; j < krit.length; j++) {
            if (i!==j) {
                if(augmented1[j][i] !== 0) {
                    const numberToSubtract = augmented1[j][i];
                    for(let ic = 0; ic < 14; ic++) {
                        augmented1[j][ic] = augmented1[j][ic] - numberToSubtract * augmented1[i][ic];
                    }
                }
            }
        }
    }

    for (let i = 0; i < krit.length; i++) {
        if (augmented2[i][i] !== 1) {
            let divisor
            if (augmented2[i][i] === 0) {
                divisor = 0.0000000001
                augmented2[i][i] = 0.0000000001
            } else {
                divisor = augmented2[i][i]
            }
            for (let ix = 0; ix < 14; ix++) {
                augmented2[i][ix] = augmented2[i][ix] / divisor
            }
        }
        for (let j = 0; j < krit.length; j++) {
            if (i!==j) {
                if(augmented2[j][i] !== 0) {
                    const numberToSubtract = augmented2[j][i];
                    for(let ic = 0; ic < 14; ic++) {
                        augmented2[j][ic] = augmented2[j][ic] - numberToSubtract * augmented2[i][ic];
                    }
                }
            }
        }
    }

    for (let i = 0; i < krit.length; i++) {
        if (augmented3[i][i] !== 1) {
            let divisor
            if (augmented3[i][i] === 0) {
                divisor = 0.0000000001
                augmented3[i][i] = 0.0000000001
            } else {
                divisor = augmented3[i][i]
            }
            for (let ix = 0; ix < 14; ix++) {
                augmented3[i][ix] = augmented3[i][ix] / divisor
            }
        }
        for (let j = 0; j < krit.length; j++) {
            if (i!==j) {
                if(augmented3[j][i] !== 0) {
                    const numberToSubtract = augmented3[j][i];
                    for(let ic = 0; ic < 14; ic++) {
                        augmented3[j][ic] = augmented3[j][ic] - numberToSubtract * augmented3[i][ic];
                    }
                }
            }
        }
    }

    const inversed1 = []
    for (let i = 0; i < krit.length; i++) {
        inversed1[i] = augmented1[i].slice(7, krit.length*2)
    }

    const inversed2 = []
    for (let i = 0; i < krit.length; i++) {
        inversed2[i] = augmented2[i].slice(7, krit.length*2)
    }

    const inversed3 = []
    for (let i = 0; i < krit.length; i++) {
        inversed3[i] = augmented3[i].slice(7, krit.length*2)
    }

    const multiplication1 = []
    for (let i = 0; i < krit.length; i++) {
        multiplication1[i] = []
        for (let j = 0; j < krit.length; j++) {
            multiplication1[i][j] = 0
            for (let k = 0; k < krit.length; k++) {  
                multiplication1[i][j] += agregatenorm1[i][k] * inversed1[k][j]
            }
        }
    }

    const multiplication2 = []
    for (let i = 0; i < krit.length; i++) {
        multiplication2[i] = []
        for (let j = 0; j < krit.length; j++) {
            multiplication2[i][j] = 0
            for (let k = 0; k < krit.length; k++) {  
                multiplication2[i][j] += agregatenorm2[i][k] * inversed2[k][j]
            }
        }
    }

    const multiplication3 = []
    for (let i = 0; i < krit.length; i++) {
        multiplication3[i] = []
        for (let j = 0; j < krit.length; j++) {
            multiplication3[i][j] = 0
            for (let k = 0; k < krit.length; k++) {  
                multiplication3[i][j] += agregatenorm3[i][k] * inversed3[k][j]
            }
        }
    }

    const transmultiplication1 = []
    for (let i = 0; i < krit.length; i++) {
        transmultiplication1[i] = []
        for (let j = 0; j < krit.length; j++) {
            transmultiplication1[i][j] = 0
            for (let k = 0; k < krit.length; k++) {  
                transmultiplication1[i][j] += agregatenorm1[i][k] * inversed1[k][j]
            }
        }
    }

    const transmultiplication2 = []
    for (let i = 0; i < krit.length; i++) {
        transmultiplication2[i] = []
        for (let j = 0; j < krit.length; j++) {
            transmultiplication2[i][j] = 0
            for (let k = 0; k < krit.length; k++) {  
                transmultiplication2[i][j] += agregatenorm2[i][k] * inversed2[k][j]
            }
        }
    }

    const transmultiplication3 = []
    for (let i = 0; i < krit.length; i++) {
        transmultiplication3[i] = []
        for (let j = 0; j < krit.length; j++) {
            transmultiplication3[i][j] = 0
            for (let k = 0; k < krit.length; k++) {  
                transmultiplication3[i][j] += agregatenorm3[i][k] * inversed3[k][j]
            }
        }
    }

    const joinmultiply = []
    for (let i = 0; i < krit.length; i++) {
        joinmultiply[i] = []
        for (let j = 0; j < krit.length; j++) {
            joinmultiply[i][j] = []
            for (let k = 0; k < dm.length; k++) {
                if (k===0) {
                    joinmultiply[i][j][k] = multiplication1[i][j]
                } else if (k===1) {
                    joinmultiply[i][j][k] = multiplication2[i][j]
                } else if (k===2) {
                    joinmultiply[i][j][k] = multiplication3[i][j]
                }
            }
        }
    }

    // const transposed = multiplication3[0].map((_, colIndex) => multiplication3.map(row => row[colIndex]));
    const transposed1 = transmultiplication1
    for (let i = 0; i < transposed1.length; i++) {
        for (let j = 0; j <i; j++) {
          //swap element[i,j] and element[j,i]
            let temp = transposed1[i][j];
            transposed1[i][j] = transposed1[j][i];
            transposed1[j][i] = temp;
        }
    }
    const transposed2 = transmultiplication2
    for (let i = 0; i < transposed2.length; i++) {
        for (let j = 0; j <i; j++) {
          //swap element[i,j] and element[j,i]
            let temp = transposed2[i][j];
            transposed2[i][j] = transposed2[j][i];
            transposed2[j][i] = temp;
        }
    }
    const transposed3 = transmultiplication3
    for (let i = 0; i < transposed3.length; i++) {
        for (let j = 0; j <i; j++) {
          //swap element[i,j] and element[j,i]
            let temp = transposed3[i][j];
            transposed3[i][j] = transposed3[j][i];
            transposed3[j][i] = temp;
        }
    }

    // console.log(multiplication1)
    // console.log(transposed1)

    // const testarr = [
    //     [0, 0.08093510511854786, 0.08093510511854786, 0.08093510511854786, 0.08093510511854786, 0.08093510511854786, 0.08093510511854786],
    //     [0.08093510511854786, 0, 0.0566545735829835, 0.0566545735829835, 0.08093510511854786, 0.0566545735829835, 0.08093510511854786],
    //     [0.08093510511854786, 0.0566545735829835, 0, 0.12140265767782182, 0.14568318921338622, 0.08093510511854786, 0.12140265767782182],
    //     [0.12140265767782182, 0.12140265767782182, 0.12140265767782182, 0, 0.12140265767782182, 0.12140265767782182, 0.12140265767782182],
    //     [0.14568318921338622, 0.14568318921338622, 0.14568318921338622, 0.14568318921338622, 0, 0.12140265767782182, 0.12140265767782182],
    //     [0.12140265767782182, 0.0566545735829835, 0.0566545735829835, 0.12140265767782182, 0.12140265767782182, 0, 0.08093510511854786],
    //     [0.08093510511854786, 0.14568318921338622, 0.12140265767782182, 0.08093510511854786, 0.08093510511854786, 0.08093510511854786, 0]]

    // console.log('krit:', kriteria)
    // console.log('perb:', perbandingan)
    // console.log('agre:', agregate)
    // console.log('norm:', normalisasi)
    // console.log('sumrownorm:', sumrow)
    // console.log('sumcolnorm:', sumcol)
    // console.log('il value:', il)
    // console.log('agrenorm:', agregatenorm)
    // console.log('agrenorm 1:', agregatenorm1)
    // console.log('agrenorm 2:', agregatenorm2)
    // console.log('agrenorm 3:', agregatenorm3)
    // console.log('default mat:', defaultmat)
    // console.log('sub 1:', subtracted1)
    // console.log('sub 2:', subtracted2)
    // console.log('sub 3:', subtracted3)
    // console.log('aug 1:', augmented1)
    // console.log('aug 2:', augmented2)
    // console.log('aug 3:', augmented3)
    // console.log('inversed1',inversed1)
    // console.log('inversed2',inversed2)
    // console.log('inversed3',inversed3)
    // console.log('multiply1',multiplication1)
    // console.log('multiply2',multiplication2)
    // console.log('multiply3',multiplication3)

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
                                    Langkah 1 : Survey hubungan antar kriteria pada DM
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                            <tr>
                                                <td>Kriteria</td>
                                                {dm.map((d, id) => {
                                                    return(
                                                    krit.map((k, ik) => {
                                                        return (
                                                            <td key={ik} colSpan="3">{namaKrit[ik]}</td>
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
                                                                        {itemL}
                                                                        {/* <br/> {indexJ}{indexL}{indexI}{indexK}  */}
                                                                        {/* {perbandingan['dm'+(indexL+1)][krit[indexK].id][indexJ+1][krit[indexI].id]} */}
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
                                <div className="table-responsive">
                                    <hr />
                                    Langkah 2 : translasi hasil kuesioner ke Dematel Scale
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
                                                                        {itemL}
                                                                        {/* <br/> {indexJ}{indexL}{indexI}{indexK}  */}
                                                                        {/* {perbandingan['dm'+(indexL+1)][krit[indexK].id][indexJ+1][krit[indexI].id]} */}
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
                                <div className="table-responsive">
                                    <hr />
                                    Langkah 3 : Buat matrix Agregated IF Direct relation matrix dengan IFWA
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                            <tr>
                                                <td>Kriteria</td>
                                                {krit.map((k, ik) => {
                                                        return (
                                                            <td key={ik} colSpan="3">C {ik+1}</td>
                                                        )
                                                })}
                                            </tr>
                                            {agregate.map((itemI, indexI) => {
                                                return (
                                                <tr key={indexI}>
                                                    
                                                    <td> {namaKrit[indexI]} </td>

                                                    {itemI.map((itemK, indexK) => {
                                                        return (
                                                            itemK.map((itemL, indexL) => {
                                                            return (
                                                            
                                                            <td key={indexL}> 
                                                                {itemL}
                                                            </td>

                                                            )})

                                                        )
                                                    })}

                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                        
                                </div>
                                <div className="table-responsive">
                                    <hr />
                                    Langkah 4 : Normalisasi Matrix
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                            <tr>
                                                <td>Kriteria</td>
                                                {krit.map((k, ik) => {
                                                    return (
                                                        <td key={ik} colSpan="1">C {ik+1}</td>
                                                    )
                                                })}
                                                <td>SUM</td>
                                            </tr>
                                            {normalisasi.map((itemI, indexI) => {
                                                return (
                                                <tr key={indexI}>
                                                    
                                                    <td> {namaKrit[indexI]} </td>

                                                    {itemI.map((itemK, indexK) => {
                                                        return (
                                                            
                                                            <td key={indexK}> 
                                                                {itemK}
                                                            </td>

                                                        )
                                                    })}

                                                    <td>{itemI.reduce((partialSum, a) => partialSum + a, 0)}</td>

                                                </tr>
                                                )
                                            })}
                                            
                                            <tr>
                                                <td>SUM</td>
                                                {namaKrit.map((itemI, indexI) => {
                                                    return (
                                                        <td key={indexI}>
                                                            {normalisasi[indexI].reduce((partialSum, a) => partialSum + a, 0)}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr />
                                    Nilai | {il}
                                    <hr />
                                    <table className="table table-striped table-bordered table-sm table-hover">
                                        <tbody>
                                            <tr>
                                                <td>Kriteria</td>
                                                {krit.map((k, ik) => {
                                                    return (
                                                        <td key={ik} colSpan="3">C {ik+1}</td>
                                                    )
                                                })}
                                            </tr>
                                            {agregatenorm.map((itemI, indexI) => {
                                                return (
                                                <tr key={indexI}>
                                                    
                                                    <td> {namaKrit[indexI]} </td>

                                                    {itemI.map((itemK, indexK) => {
                                                        return (
                                                            itemK.map((itemL, indexL) => {
                                                            return (
                                                            
                                                            <td key={indexL}> 
                                                                {itemL}
                                                            </td>

                                                            )})

                                                        )
                                                    })}

                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-responsivexx">
                                    <hr />
                                    Langkah 5 : buat total-relation IF Matrix
                                    <div className="row">
                                        <div className="col-4 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                            return (
                                                                <td key={ik} colSpan="1">C {ik+1}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                    {agregatenorm1.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    
                                                                    <td key={indexK}> 
                                                                        {itemK}
                                                                    </td>

                                                                )
                                                            })}

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                        <div className="col-4 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                                return (
                                                                    <td key={ik} colSpan="1">C {ik+1}</td>
                                                                )
                                                        })}
                                                    </tr>
                                                    {agregatenorm2.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    
                                                                    <td key={indexK}> 
                                                                        {itemK}
                                                                    </td>

                                                                )
                                                            })}

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                        <div className="col-4 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                                return (
                                                                    <td key={ik} colSpan="1">C {ik+1}</td>
                                                                )
                                                        })}
                                                    </tr>
                                                    {agregatenorm3.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    
                                                                    <td key={indexK}> 
                                                                        {itemK}
                                                                    </td>

                                                                )
                                                            })}

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-4 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                                return (
                                                                    <td key={ik} colSpan="1">C {ik+1}</td>
                                                                )
                                                        })}
                                                    </tr>
                                                    {multiplication1.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    
                                                                    <td key={indexK}> 
                                                                        {itemK}
                                                                    </td>

                                                                )
                                                            })}

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                        <div className="col-4 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                                return (
                                                                    <td key={ik} colSpan="1">C {ik+1}</td>
                                                                )
                                                        })}
                                                    </tr>
                                                    {multiplication2.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    
                                                                    <td key={indexK}> 
                                                                        {itemK}
                                                                    </td>

                                                                )
                                                            })}

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                        <div className="col-4 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                                return (
                                                                    <td key={ik} colSpan="1">C {ik+1}</td>
                                                                )
                                                        })}
                                                    </tr>
                                                    {multiplication3.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    
                                                                    <td key={indexK}> 
                                                                        {itemK}
                                                                    </td>

                                                                )
                                                            })}

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        {krit.map((k, ik) => {
                                                            return (
                                                                <td key={ik} colSpan="3">C {ik+1}</td>
                                                            )
                                                        })}
                                                        <td key={'sumD'} colSpan="3">D</td>
                                                    </tr>
                                                    {joinmultiply.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            {itemI.map((itemK, indexK) => {
                                                                return (
                                                                    itemK.map((itemL, indexL) => {
                                                                    return (
                                                                    
                                                                    <td key={indexL}> 
                                                                        {itemL}
                                                                    </td>

                                                                    )})

                                                                )
                                                            })}

                                                            <td>{multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>

                                                        </tr>
                                                        )
                                                    })}
                                            
                                                    <tr>
                                                        <td>R</td>
                                                        {joinmultiply.map((itemI, indexI) => {
                                                            return (
                                                                <>
                                                                <td>
                                                                    {transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0)}
                                                                </td>
                                                                <td>
                                                                    {transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0)}
                                                                </td>
                                                                <td>
                                                                    {transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0)}
                                                                </td>
                                                                </>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsivexx">
                                    <hr />
                                    Langkah 5.1 : buat matrix causal effect group
                                    <div className="row">
                                        <div className="col-12 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        <td key={'sumD'} colSpan="3">D</td>
                                                        <td key={'sumR'} colSpan="3">R</td>
                                                        <td key={'sumD+R'} colSpan="3">D+R</td>
                                                        <td key={'sumD-R'} colSpan="3">D-R</td>
                                                    </tr>
                                                    {joinmultiply.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            <td>{multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>

                                                            <td>{transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            

                                                            <td>{multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0) + transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0) + transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0) + transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            

                                                            <td>{multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>
                                                            <td>{multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0)}</td>

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsivexx">
                                    <hr />
                                    Langkah 5.2 : De-fuzzyfy hasil
                                    <div className="row">
                                        <div className="col-12 table-responsive">
                                            
                                            <table className="table table-striped table-bordered table-sm table-hover">
                                                <tbody>
                                                    <tr>
                                                        <td>Kriteria</td>
                                                        <td key={'sumD'} colSpan="1">D</td>
                                                        <td key={'sumR'} colSpan="1">R</td>
                                                        <td key={'sumD+R'} colSpan="1">D+R</td>
                                                        <td key={'sumD-R'} colSpan="1">D-R</td>
                                                    </tr>
                                                    {joinmultiply.map((itemI, indexI) => {
                                                        return (
                                                        <tr key={indexI}>
                                                            
                                                            <td> {namaKrit[indexI]} </td>

                                                            <td>
                                                                {multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0) - multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0) + (2*0.5-1) * multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0)}
                                                            </td>

                                                            <td>
                                                                {transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0) + (2*0.5-1) * transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0)}
                                                            </td>
                                                            

                                                            <td>
                                                                {(multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0) + transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0)) - (multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0) + transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0)) + (2*0.5-1) * (multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0) + transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0))}
                                                            </td>
                                                            

                                                            <td>
                                                                {(multiplication1[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed1[indexI].reduce((partialSum, a) => partialSum + a, 0)) - (multiplication2[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed2[indexI].reduce((partialSum, a) => partialSum + a, 0)) + (2*0.5-1) * (multiplication3[indexI].reduce((partialSum, a) => partialSum + a, 0) - transposed3[indexI].reduce((partialSum, a) => partialSum + a, 0))}
                                                            </td>

                                                        </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainPage>
    )
    
}

export default DematelAdminPage;