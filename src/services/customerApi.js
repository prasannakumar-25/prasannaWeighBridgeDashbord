import Authaxios from "../axios/axios";

const customerApi = {
    addCustomerDetails : async (payload) => {
        try{
            const response = await Authaxios.post("/add/customer", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getCustomerDetails : async () => {
        try{
            const response = await Authaxios.get("/get/customer")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterCustomerDetails : async (Customer_Id) => {
        try{
            const response = await Authaxios.get(`/get/customer?Customer_Id=${Customer_Id}`)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updateCustomerDetails : async (customer_id, payload) => {
        try{
            const response = await Authaxios.put(`/update/customer/${customer_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteCustomerDetails : async (customer_id, payload) => {
        try{
            const response = await Authaxios.delete(`/delete/customer${customer_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
}

export default customerApi