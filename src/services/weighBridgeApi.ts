import Authaxios from "../axios/axios";


const weighBridgeApi = {
    addWeighbridgeDetails : async (payload:object) => {
        try{
            const response = await Authaxios.post("/add/weighbridge", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getWeighbridgeDetails : async () => {
        try{
            const response = await Authaxios.get("/get/weighbridge")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterWeighbridgeDetails : async (Weighbridge_Id:number) => {
        try{
            const response = await Authaxios.get(`/get/weighbridge?Weighbridge_Id=${Weighbridge_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updateWeighbridgeDetails : async (weighbridge_id:number, payload:object) => {
        try{
            const response = await Authaxios.put(`/update/weighbridge/${weighbridge_id}`,payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteWeighbridgeDetails : async (weighbridge_id:number) => {
        try{
            const response = await Authaxios.delete(`/delete/weighbridge/${weighbridge_id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default weighBridgeApi