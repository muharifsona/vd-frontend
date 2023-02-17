import api from "./api" 

export const findAllPerbandingan = async () => {
    return await api.get("/api/perbandingan")
}

export const findPerbandinganById = async (id) => {
    return await api.get(`/api/perbandingan/${id}`)
}

export const createPerbandingan = async (perbandingan) => {
    return await api.post("/api/perbandingan", perbandingan)
}

export const updatePerbandingan = async (perbandingan) => {
    return await api.put("/api/perbandingan", perbandingan)
}

export const deletePerbandinganById = async (id) => {
    return await api.delete(`/api/perbandingan/${id}`)
}