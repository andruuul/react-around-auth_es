const BASE_URL = 'https://register.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then((res) => res.json())
}
  
export const authorize = (userid, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userid, password }),
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
      return data;
    } else {
      return;
    }
  });
}
  
export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      return res.json();
    }
    const body = await res.json();
    return Promise.reject(body.error || body.message);
  });
}