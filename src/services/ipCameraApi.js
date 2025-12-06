import axios from "axios";
import Authaxios from "../axios/axios";

const ipCameraApi = {

    addIPcameraDetails : async (payload) => {
        try{
            const response = await Authaxios.post("add/ipcamera", payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getIPcameraDetails : async () => {
        try{
            const response = await Authaxios.get("get/ipcamera")
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    getFilterIPcameraDetails : async (Camera_Id, payload) => {
        try{
            const response = await Authaxios.get(`get/ipcamera?Camera_Id=${Camera_Id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    updateIPcameraDetails : async (camera_id, payload) => {
        try{
            const response = await Authaxios.get(`update/ipcamera/${camera_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    },
    deleteIPcameraDetails : async (camera_id, payload) => {
        try{
            const response = await Authaxios.delete(`delete/ipcamera/${camera_id}`, payload)
            return response.data
        }
        catch (error){
            console.error("error")
            throw error
        }
    }
}

export default ipCameraApi