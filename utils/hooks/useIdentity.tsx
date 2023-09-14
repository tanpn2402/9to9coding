import { gql, useQuery } from '@apollo/client';
import { User } from '@prisma/client';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect } from 'react';

const UserQuery = gql`
  query UserQuery($id: String!) {
    user: userById(id: $id) {
      id
      email
      name
    }
  }
`;

type TData = {
  user?: User;
};

export const useIdentity = () => {
  const token = getCookie('X-3X-4X');
  // token is user_id :___)
  const { refetch, data } = useQuery<TData>(UserQuery, {
    variables: {
      id: token
    }
  });

  useEffect(() => {
    refetch({
      id: token
    });
  }, [token]);

  return data?.user;
};
