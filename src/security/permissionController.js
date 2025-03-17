import axios from "axios";

const baseUrl = 'http://localhost:8080/auth';

const authUrl = {
    checkAdmin: baseUrl + '/admin',
    checkCreator: baseUrl + '/creator',
    checkAdminOrCreator: baseUrl + '/adminorcreator',
    checkAcessStoryEdit: baseUrl + '/editor/haveaccess/:chapterId',
    checkUser: baseUrl + '/validate-user',
    refreshToken: baseUrl + '/refresh-token'
};

export const permissionControl = {
    checkAllowAdmin: async ( accessToken ) => {
        try {
            const response = await axios.get(authUrl.checkAdmin, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            return response.status === 200;
        } catch (error) {
            console.error("Error checking admin permission:", error);
            return false;
        }
    },
    checkAllowCreator: async ( accessToken ) => {
        try {
            const response = await axios.get(authUrl.checkCreator, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            return response.status === 200;
        } catch (error) {
            console.error("Error checking creator permission:", error);
            return false;
        }
    },
    checkAllowAdminOrCreator: async ( accessToken ) => {
        try {
            const response = await axios.get(authUrl.checkAdminOrCreator, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            return response.status === 200;
        } catch (error) {
            console.error("Error checking admin or creator permission:", error);
            return false;
        }
    },
    checkAcessToEditStory: async(accessToken, chapterId) => {
        try{
            const response = await axios.get(authUrl.checkAcessStoryEdit.replace(':chapterId', chapterId), {headers:{"Authorization": `Bearer ${accessToken}`}})
            return response.status == 200
        } catch(error){
            console.log("Error: You don't have access to edit this content. Error MSG", error)
            return false
        }
    },
    refreshToken: async(refreshToken) => {
        try{
            const response = await axios.post(authUrl.refreshToken, {
                refreshToken: refreshToken
            })
            if(response.status == 200){
                return response.data.accessToken
            }else{
                return null;
            }
        }catch(err){
            console.log("Err: Can't refresh token.")
        }
    },
    checkUser: async(accessToken) => {
        try{
            const response = await(axios.get(authUrl.checkUser, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }))
            return(response)
        }catch(err){
            console.log("Error on validate user.")
            console.log(err)
        }
    },
    kick: (navigate) => {
        alert("Permission error.");
        // Clear cookies
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${location.hostname}`;
        });
        // Redirect to login
        navigate("/login");
    },
};
