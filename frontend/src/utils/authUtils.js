

export function checkToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw { status: 401 };
    }
    return token;
}


export function canAccess() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw { status: 401 };
    }

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role === 'Administrador' || decoded.role === 'Master';
}