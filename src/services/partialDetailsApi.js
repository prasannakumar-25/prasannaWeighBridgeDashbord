import Authaxios from "../axios/axios";

const partialDetailsApi = {
    addPartialDetails : async (payload) => {
        try{
            const response = await Authaxios.post("/add/partialdetails", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getPartialDetails : async () => {
        try{
            const response = await Authaxios.get("/get/partialDetails")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterPartialDetails : async (Partial_Id) => {
        try{
            const response = await Authaxios.get(`/get/partialDetails?Partial_Id=${Partial_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updatePartialDetails : async (partial_id, payload) => {
        try{
            const response = await Authaxios.put(`/update/partialDetails/${partial_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deletePartialDetails : async (partial_id, payload) => {
        try{
            const response = await Authaxios.delete(`/delete/partialDetails${partial_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default partialDetailsApi