import Authaxios from "../axios/axios";


const authApi = {

    authregister : async(payload:object)=>{

        try{
               const response=await Authaxios.post("/auth/register",payload)
               return response.data
        }
        catch(error)
        {
            console.error("Failed to Register a user")
            throw error
        }
    },
    addauthuser : async (payload: object) => {
        try {
            const response = await Authaxios.post("/login", payload)
            return response.data
        }
        catch(error) {
            console.error("error")
            throw error
        }
    },
    getauthuser : async () => {
        try {
            const response = await Authaxios.get("/auth/users")
            return response.data
        }
        catch(error) {
            console.error("error")
            throw error
        }
    }
}

export default authApi
    