import axios from 'axios';
import { baseUrl } from './config';

export const isBrowser = () => typeof window !== 'undefined';

export const getUser = () =>
  isBrowser() && window.localStorage.getItem('user')
    ? //   window.localStorage.getItem("user")
      JSON.parse(window.localStorage.getItem('user'))
    : {};

export const getToken = () => {
  const user = getUser();
  return user.token;
};

export const setUser = (user) => window.localStorage.setItem('user', JSON.stringify(user));

export const isLoggedIn = () => {
  const user = getUser();
  const loggedIn = Object.keys(user).length == 0 ? false : true;
  return loggedIn;
};

export const logout = () => {
  setUser({});
};

export const getRatings = (show_id) => {
  const user = getUser();
  if (Object.keys(user).length != 0) {
    let ratings = user.ratings;
    const showRating = ratings.filter((show) => show.show_id == show_id);
    return showRating[0];
  } else {
    return [];
  }
};

export const updateRatings = () => {
  const user = getUser();
  const token = getToken();
  axios
    .get(baseUrl + 'getratings', {
      auth: {
        username: token,
        password: '',
      },
    })
    .then((response) => {
      const newRatings = response.data;
      user.ratings = newRatings;
      setUser(user);
    })
    .catch((error) => {
      console.log(error);
    });
};
