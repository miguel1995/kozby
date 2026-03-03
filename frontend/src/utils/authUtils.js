export function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw { status: 401 };
    }
    return token;
}