import Authaxios from "../axios/axios";

const weighmentDetailsApi = {
    addWeighmentDetails : async (payload) => {
        try{
            const response = await Authaxios.post("/add/weighmentDetails", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getWeighmentDetails : async () => {
        try{
            const response = await Authaxios.get("/get/weighment")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterWeighmentDetails : async (Weighment_Id) => {
        try{
            const response = await Authaxios.get(`/get/weighment?Weighment_Id=${Weighment_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updateWeighmentDetails : async (weighment_id, payload) => {
        try{
            const response = await Authaxios.put(`/update/weighment/${weighment_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteWeighmentDetails : async (weighment_id, payload) => {
        try{
            const response = await Authaxios.delete(`/delete/weightDetails${weighment_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default weighmentDetailsApi