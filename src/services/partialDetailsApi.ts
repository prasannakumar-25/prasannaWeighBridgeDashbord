import Authaxios from "../axios/axios";

const partialDetailsApi = {
    addPartialDetails : async (payload:object) => {
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
    getFilterPartialDetails : async (Partial_Id:number) => {
        try{
            const response = await Authaxios.get(`/get/partialDetails?Partial_Id=${Partial_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updatePartialDetails : async (partial_id:number, payload:object) => {
        try{
            const response = await Authaxios.put(`/update/partialDetails/${partial_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deletePartialDetails : async (partial_id:number) => {
        try{
            const response = await Authaxios.delete(`/delete/partialDetails/${partial_id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default partialDetailsApi