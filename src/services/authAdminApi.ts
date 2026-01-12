import Authaxios  from "axios/axios";

const authAdminApi = {
    addauthAdmin : async (payload:object) => {
        try {
            const response = await Authaxios.post("/authadmin/regiater", payload)
            return response.data
        }
        catch (error) {
            console.log("error")
            throw error
        }
    }
}

export default authAdminApi