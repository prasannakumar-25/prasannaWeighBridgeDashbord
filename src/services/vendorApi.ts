import Authaxios from "../axios/axios";


const vendorApi = {
    addVendor: async (payload:object) => {
        try{
            const response = await Authaxios.post("/add/vendor",payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getVendordetails: async () => {
        try{
            const response = await Authaxios.get("/get/vendor")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterVendordetails: async (Vendor_Id:number) => {
        try{
            const response = await Authaxios.get(`/get/vendor?Vendor_Id=${Vendor_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updateVendordetails: async (vendor_id:number,payload:object) => {
        try{
            const response = await Authaxios.put(`/update/vendor/${vendor_id}`,payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteVendordetails: async (vendor_id:number,payload:object) => {
        try{
            const response = await Authaxios.delete(`/delete/vendor/${vendor_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    }

}

export default vendorApi




