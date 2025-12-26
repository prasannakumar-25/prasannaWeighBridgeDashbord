import Authaxios from "../axios/axios";

const vehicletypeApi = {
    addVehicleDetails : async (payload:object) => {
        try{
            const response = await Authaxios.post("/add/vehicle", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getVehicleDetails : async () => {
        try{
            const response = await Authaxios.get("/get/vehicle")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterVehicleDetails : async (Vehicle_Id:number) => {
        try{
            const response = await Authaxios.get(`/get/vehicle?Vehicle_Id=${Vehicle_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")  
            throw error
        }
    },
    updateVehicleDetails : async (vehicle_id:number, payload:object) => {
        try{
            const response = await Authaxios.put(`/update/vehicle/${vehicle_id }`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteVehicleDetails : async (vehicle_id:number) => {
        try{
            const response = await Authaxios.delete(`/delete/vehicle/${vehicle_id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default vehicletypeApi