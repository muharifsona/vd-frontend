import api from "./api" 

export const findAllAlternatifKriteria = async () => {
    return await api.get("/api/alternatifkriteria")
}

export const findAlternatifKriteriaById = async (id) => {
    return await api.get(`/api/alternatifkriteria/${id}`)
}

export const createAlternatifKriteria = async (alternatifkriteria) => {
    return await api.post("/api/alternatifkriteria", alternatifkriteria)
}

export const updateAlternatifKriteria = async (alternatifkriteria) => {
    return await api.put("/api/alternatifkriteria", alternatifkriteria)
}

export const deleteAlternatifKriteriaById = async (id) => {
    return await api.delete(`/api/alternatifkriteria/${id}`)
}