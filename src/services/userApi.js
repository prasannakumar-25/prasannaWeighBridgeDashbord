import Authaxios from "../axios/axios";

const userApi = {
    addUserDetails : async (payload) => {
        try{
            const response = await Authaxios.post("/add/user", payload) 
            return response.data
        }
        catch (error) {
            console.error("error")
            throw error
        }
    },
    getUserDetails : async () => {
        try{
            const response = await Authaxios.get("/get/user")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterUserDetails: async (User_Id) => {
        try{
            const response = await Authaxios.get(`/get/user?User_Id=${User_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updateUserDetails : async (user_id, payload) => {
        try{
            const response = await Authaxios.put(`/update/user/${user_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    daleteUserDateils : async (user_id, payload) => {
        try{
            const response = await Authaxios.delete(`/delete/user/${user_id}`, payload)
            return response.data
        }
        catch{
            console.error("error")
            throw error
        }
    },
}

export default userApi