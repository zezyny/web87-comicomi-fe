import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie'; // Import useCookies from react-cookie

const API_BASE_URL = 'http://localhost:8080/auth'; // For development only!

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: 'member',
        loginEmail: '',
        loginPassword: ''
    });
    const [message, setMessage] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setuserId] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken', 'userRole', 'userId']); // Include userRole in useCookies

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setAccessToken('');
        setRefreshToken('');

        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            setMessage('Registration successful! Please login.');
            setIsRegister(false);

        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                setMessage(`Registration failed: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                setMessage('Registration failed: No response from server.');
            } else {
                setMessage('Registration failed: Request setup error.');
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setAccessToken('');
        setRefreshToken('');

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: formData.loginEmail,
                password: formData.loginPassword
            });

            console.log("Login API Response:", response.data); // **Log the entire login API response**

            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const userRole = response.data.user.role; // **Attempt to get userRole**
            const userId = response.data.user._id

            console.log("Extracted userRole from response:", userRole); // **Log extracted userRole**


            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUserRole(userRole); // Call setUserRole to store it in cookie
            setuserId(userId)
            setMessage('Login successful! Tokens and role stored in cookies.');

            const expiresDays = 7;
            const expiryDate = new Date(); // Get current date
            expiryDate.setDate(expiryDate.getDate() + expiresDays); // Add 7 days
            console.log("Expires Date:", expiryDate, ", Type:", typeof expiryDate); // Log Date object and its type

            // Store tokens and userRole in cookies using setCookie
            const cookieOptions = {
                expires: expiryDate, // Example: Refresh token expires in 7 days
                path: '/',     // Cookie available across the whole domain
                sameSite: 'Strict', // For CSRF protection
                secure: false,  // Set to true in production for HTTPS only cookies! (development is often HTTP)
                // httpOnly: true, // Uncomment for enhanced security in production (JS cannot access httpOnly cookies)
            };
            setCookie('accessToken', accessToken, cookieOptions);
            setCookie('refreshToken', refreshToken, cookieOptions);
            setCookie('userRole', userRole, cookieOptions); // **Set userRole cookie**
            setCookie('userId', userId, cookieOptions); // **Set userRole cookie**
            
            // console.log("userRole cookie set successfully:", .get('userRole')); // **Verify cookie is set**


        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                setMessage(`Login failed: ${error.response.data.message || 'Invalid credentials'}`);
            } else if (error.request) {
                setMessage('Login failed: No response from server.');
            } else {
                setMessage('Login failed: Request setup error.');
            }
        }
    };


    const handleRefreshToken = async () => {
        setMessage('');
        setAccessToken('');

        const storedRefreshToken = cookies.refreshToken; // Get refresh token from cookie using cookies object
        if (!storedRefreshToken) {
            setMessage('No refresh token cookie found. Please login first.');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
                refreshToken: storedRefreshToken
            });

            const newAccessToken = response.data.accessToken;
            setAccessToken(newAccessToken);
            setMessage('Access token refreshed using refresh token from cookies!');

            // Update access token cookie using setCookie
            const cookieOptions = {
                expires: 7, // Keep options consistent with login
                path: '/',
                sameSite: 'Strict',
                secure: false, // Set to true in production
                // httpOnly: true, // Uncomment in production
            };
            setCookie('accessToken', newAccessToken, cookieOptions);


        } catch (error) {
            console.error('Refresh token error:', error);
            if (error.response) {
                setMessage(`Refresh token failed: ${error.response.data.message || 'Invalid refresh token'}`);
            } else if (error.request) {
                setMessage('Refresh token failed: No response from server.');
            } else {
                setMessage('Refresh token failed: Request setup error.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>{isRegister ? 'Register (for development only)' : 'Login (for development only)'}</h2>
            {message && <p style={{ color: message.startsWith('Success') ? 'green' : 'red' }}>{message}</p>}

            {isRegister ? (
                <form onSubmit={handleRegister}>
                    <input type="text" name="userName" placeholder="Username" required onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                    <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
                        <option value="member">Member</option>
                        <option value="creator">Creator</option>
                    </select>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
                    <button type="button" onClick={() => setIsRegister(false)} style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Already have an account? Login</button>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
                    <input type="email" name="loginEmail" placeholder="Email" required onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                    <input type="password" name="loginPassword" placeholder="Password" required onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
                    <button type="button" onClick={() => setIsRegister(true)} style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Need an account? Register</button>
                    <button type="button" onClick={handleRefreshToken} style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Refresh Token (Dev Only)</button>

                    {cookies.accessToken && <div style={{ marginTop: '20px', wordWrap: 'break-word' }}><strong>Access Token (Dev Only - from Cookie):</strong> <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>{cookies.accessToken}</pre></div>}
                    {cookies.refreshToken && <div style={{ marginTop: '10px', wordWrap: 'break-word' }}><strong>Refresh Token (Dev Only - from Cookie):</strong> <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>{cookies.refreshToken}</pre></div>}
                    {cookies.userRole && <div style={{ marginTop: '10px', wordWrap: 'break-word' }}><strong>User Role (Dev Only - from Cookie):</strong> <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>{cookies.userRole}</pre></div>}
                    {cookies.userId && <div style={{ marginTop: '10px', wordWrap: 'break-word' }}><strong>User ID (Dev Only - from Cookie):</strong> <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>{cookies.userId}</pre></div>}
                </form>
            )}
        </div>
    );
};

export default AuthForm;