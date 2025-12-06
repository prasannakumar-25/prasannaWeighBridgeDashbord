import Authaxios from "../axios/axios";


const machineApi = {
    addMachinDetails : async (payload) => {
        try{
            const response = await Authaxios.post("/add/machine", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getMachineDetails : async () => {
        try{
            const response = await Authaxios.get("/get/machine")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterMachineDetails : async (Machine_Id) => {
        try{
            const response = await Authaxios.get(`/get/machine?Machine_Id=${Machine_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updataMachineDetailes : async (machine_id, payload) => {
        try{
            const response = await Authaxios.put(`/update/machine${machine_id}`,payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteMachineDetails : async (machine_id, payload) => {
        try{
            const response = await Authaxios.delete(`/delete/machine/${machine_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default machineApi