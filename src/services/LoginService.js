import api from "./api" 

export const findAllLogin = async () => {
    return await api.get("/api/login")
}

export const findLoginById = async (id) => {
    return await api.get(`/api/login/${id}`)
}

export const createLogin = async (login) => {
    return await api.post("/api/login", login)
}

export const updateLogin = async (login) => {
    return await api.put("/api/login", login)
}

export const deleteLoginById = async (id) => {
    return await api.delete(`/api/login/${id}`)
}