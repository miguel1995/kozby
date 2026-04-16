

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
        return false;
    }

    try {
        const payload = token.split('.')[1];
        if (!payload) {
            return false;
        }

        const decoded = JSON.parse(atob(payload));
        return decoded?.role === 'Administrador' || decoded?.role === 'Master';
    } catch (err) {
        return false;
    }
}

export const getUserName = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded?.username || '';
}

