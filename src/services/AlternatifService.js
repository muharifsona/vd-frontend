import api from "./api" 

export const findAllAlternatif = async () => {
    return await api.get("/api/alternatif")
}

export const findAlternatifById = async (id) => {
    return await api.get(`/api/alternatif/${id}`)
}

export const createAlternatif = async (alternatif) => {
    return await api.post("/api/alternatif", alternatif)
}

export const updateAlternatif = async (alternatif) => {
    return await api.put("/api/alternatif", alternatif)
}

export const deleteAlternatifById = async (id) => {
    return await api.delete(`/api/alternatif/${id}`)
}