import Authaxios from "../axios/axios";


const authApi = {
    addauthuser:async (payload: object) => {
        try {
            const response = await Authaxios.post("/login", payload)
            return response.data
        }
        catch(error) {
            console.error("error")
            throw error
        }
    },
}

export default authApi
