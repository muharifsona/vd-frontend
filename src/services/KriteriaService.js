import api from "./api" 

export const findAllKriteria = async () => {
    return await api.get("/api/kriteria")
}

export const findKriteriaById = async (id) => {
    return await api.get(`/api/kriteria/${id}`)
}

export const createKriteria = async (kriteria) => {
    return await api.post("/api/kriteria", kriteria)
}

export const updateKriteria = async (kriteria) => {
    return await api.put("/api/kriteria", kriteria)
}

export const deleteKriteriaById = async (id) => {
    return await api.delete(`/api/kriteria/${id}`)
}