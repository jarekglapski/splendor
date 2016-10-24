import UserType from '../types/UserType';

const users = {
  type: UserType,
  resolve({ request }) {
    return request.user && {
      id: request.user.id,
      email: request.user.email,
    };
  },
};

export default users;
