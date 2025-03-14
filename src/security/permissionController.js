import axios from "axios";

const baseUrl = 'http://localhost:8080/auth';

const authUrl = {
    checkAdmin: baseUrl + '/admin',
    checkCreator: baseUrl + '/creator',
    checkAdminOrCreator: baseUrl + '/adminorcreator',
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
